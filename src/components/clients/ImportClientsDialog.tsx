import { useState, useCallback } from "react";
import { Upload, FileSpreadsheet, Loader2, AlertCircle, Check } from "lucide-react";
import Papa from "papaparse";
import { parse, isValid, format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const DATE_FORMATS = [
  "yyyy-MM-dd",
  "MM/dd/yyyy",
  "dd/MM/yyyy",
  "MM-dd-yyyy",
  "d/M/yyyy",
  "M/d/yyyy",
  "dd-MM-yyyy",
];

const parseDate = (dateString: string | undefined | null): string | null => {
  if (!dateString || !dateString.trim()) return null;
  
  const cleaned = dateString.trim();
  
  for (const dateFormat of DATE_FORMATS) {
    const parsed = parse(cleaned, dateFormat, new Date());
    if (isValid(parsed)) {
      return format(parsed, "yyyy-MM-dd");
    }
  }
  
  return null;
};

interface ImportClientsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface ParsedRow {
  name?: string;
  phone?: string;
  email?: string;
  vehicle_details?: string;
  last_service_date?: string;
  [key: string]: string | undefined;
}

const COLUMN_MAPPINGS: Record<string, string[]> = {
  name: ["name", "client name", "customer name", "full name", "client"],
  phone: ["phone", "phone number", "telephone", "mobile", "cell", "contact"],
  email: ["email", "email address", "e-mail"],
  vehicle_details: ["vehicle", "vehicle details", "car", "vehicle type", "model", "make"],
  last_service_date: ["last service", "last service date", "service date", "last visit"],
};

export const ImportClientsDialog = ({ open, onOpenChange }: ImportClientsDialogProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<ParsedRow[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [columnMap, setColumnMap] = useState<Record<string, string>>({});
  const [isUploading, setIsUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const resetState = () => {
    setFile(null);
    setParsedData([]);
    setHeaders([]);
    setColumnMap({});
  };

  const autoMapColumns = (csvHeaders: string[]) => {
    const mapping: Record<string, string> = {};
    
    for (const [dbColumn, possibleNames] of Object.entries(COLUMN_MAPPINGS)) {
      for (const csvHeader of csvHeaders) {
        const normalizedHeader = csvHeader.toLowerCase().trim();
        if (possibleNames.includes(normalizedHeader)) {
          mapping[dbColumn] = csvHeader;
          break;
        }
      }
    }
    
    return mapping;
  };

  const handleFileSelect = useCallback((selectedFile: File) => {
    if (!selectedFile.name.endsWith(".csv")) {
      toast({
        title: "Invalid file type",
        description: "Please upload a CSV file",
        variant: "destructive",
      });
      return;
    }

    setFile(selectedFile);

    Papa.parse<ParsedRow>(selectedFile, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const csvHeaders = results.meta.fields || [];
        setHeaders(csvHeaders);
        setParsedData(results.data);
        setColumnMap(autoMapColumns(csvHeaders));
      },
      error: () => {
        toast({
          title: "Parse error",
          description: "Failed to parse CSV file",
          variant: "destructive",
        });
      },
    });
  }, [toast]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) handleFileSelect(droppedFile);
  }, [handleFileSelect]);

  const handleImport = async () => {
    setIsUploading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("Not authenticated");
      }

      const validRows: Array<{
        user_id: string;
        name: string;
        phone: string;
        email: string | null;
        vehicle_details: string;
        last_service_date: string | null;
        status: string;
        total_revenue: number;
      }> = [];
      
      const skippedRows: number[] = [];

      parsedData.forEach((row, index) => {
        const name = columnMap.name ? row[columnMap.name]?.trim() : undefined;
        const phone = columnMap.phone ? row[columnMap.phone]?.trim() : undefined;

        if (!name || !phone) {
          skippedRows.push(index + 1);
          return;
        }

        validRows.push({
          user_id: user.id,
          name,
          phone,
          email: columnMap.email ? row[columnMap.email]?.trim() || null : null,
          vehicle_details: columnMap.vehicle_details 
            ? row[columnMap.vehicle_details]?.trim() || "Unknown Vehicle" 
            : "Unknown Vehicle",
          last_service_date: columnMap.last_service_date 
            ? parseDate(row[columnMap.last_service_date]) 
            : null,
          status: "Active",
          total_revenue: 0,
        });
      });

      if (validRows.length === 0) {
        toast({
          title: "No valid rows",
          description: "All rows are missing required fields (name and phone)",
          variant: "destructive",
        });
        setIsUploading(false);
        return;
      }

      const { error } = await supabase.from("clients").insert(validRows);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ["clients"] });
      queryClient.invalidateQueries({ queryKey: ["client-stats"] });

      toast({
        title: `Successfully imported ${validRows.length} clients`,
        description: skippedRows.length > 0 
          ? `Skipped ${skippedRows.length} rows with missing data` 
          : undefined,
      });

      onOpenChange(false);
      resetState();
    } catch (error) {
      toast({
        title: "Import failed",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const previewRows = parsedData.slice(0, 5);
  const hasRequiredMappings = columnMap.name && columnMap.phone;

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      onOpenChange(isOpen);
      if (!isOpen) resetState();
    }}>
      <DialogContent className="max-w-2xl bg-secondary/95 backdrop-blur-xl border-glass-border">
        <DialogHeader>
          <DialogTitle className="font-display text-xl flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-primary" />
            Import Clients from CSV
          </DialogTitle>
          <DialogDescription>
            Upload a CSV file to bulk import your client list
          </DialogDescription>
        </DialogHeader>

        {!file ? (
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragOver 
                ? "border-primary bg-primary/10" 
                : "border-glass-border hover:border-primary/50"
            }`}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
          >
            <Upload className="w-10 h-10 mx-auto mb-3 text-muted-foreground" />
            <p className="text-muted-foreground mb-2">
              Drag and drop your CSV file here, or
            </p>
            <label>
              <input
                type="file"
                accept=".csv"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleFileSelect(f);
                }}
              />
              <Button variant="outline" className="cursor-pointer" asChild>
                <span>Browse Files</span>
              </Button>
            </label>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-2 p-3 rounded-lg bg-background/50 border border-glass-border">
              <FileSpreadsheet className="w-5 h-5 text-primary" />
              <span className="flex-1 truncate">{file.name}</span>
              <Button variant="ghost" size="sm" onClick={resetState}>
                Change
              </Button>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium">Column Mapping</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {Object.entries(COLUMN_MAPPINGS).map(([dbCol]) => (
                  <div key={dbCol} className="flex items-center gap-2 p-2 rounded bg-background/30">
                    <span className="w-28 capitalize text-muted-foreground">
                      {dbCol.replace("_", " ")}
                      {(dbCol === "name" || dbCol === "phone") && (
                        <span className="text-destructive ml-1">*</span>
                      )}
                    </span>
                    {columnMap[dbCol] ? (
                      <span className="flex items-center gap-1 text-green-400">
                        <Check className="w-3 h-3" />
                        {columnMap[dbCol]}
                      </span>
                    ) : (
                      <span className="text-muted-foreground italic">Not mapped</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {previewRows.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Preview (first 5 rows)</h4>
                <div className="overflow-x-auto rounded-lg border border-glass-border">
                  <table className="w-full text-xs">
                    <thead className="bg-background/50">
                      <tr>
                        {headers.slice(0, 5).map((h) => (
                          <th key={h} className="px-3 py-2 text-left font-medium">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {previewRows.map((row, i) => (
                        <tr key={i} className="border-t border-glass-border">
                          {headers.slice(0, 5).map((h) => (
                            <td key={h} className="px-3 py-2 truncate max-w-[150px]">
                              {row[h] || "-"}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {!hasRequiredMappings && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/30 text-sm">
                <AlertCircle className="w-4 h-4 text-destructive" />
                <span>
                  Your CSV must have columns for <strong>name</strong> and <strong>phone</strong>
                </span>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="ghost" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button
                variant="neon"
                onClick={handleImport}
                disabled={!hasRequiredMappings || isUploading}
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Importing...
                  </>
                ) : (
                  `Import ${parsedData.length} Clients`
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
