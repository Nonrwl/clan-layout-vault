import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Upload, FileSpreadsheet } from 'lucide-react';
import Papa from 'papaparse';
import { supabase } from '@/integrations/supabase/client';
import { BaseType, HallType } from '@/types/database';

interface CSVRow {
  name: string;
  image_path: string;
  layout_link: string;
  description?: string;
  stats?: string;
  tips?: string;
}

export function AdminUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [hallType, setHallType] = useState<HallType>('TH');
  const [hallLevel, setHallLevel] = useState<number>(17);
  const [baseType, setBaseType] = useState<BaseType>('WAR');
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === 'text/csv') {
      setFile(selectedFile);
    } else {
      toast({
        title: "Invalid File",
        description: "Please select a CSV file.",
        variant: "destructive"
      });
    }
  };

  const processCSV = async () => {
    if (!file) return;

    setIsUploading(true);
    
    try {
      const text = await file.text();
      const results = Papa.parse(text, {
        header: true,
        skipEmptyLines: true
      });

      const csvData = results.data as CSVRow[];
      
      // Validate CSV structure
      if (csvData.length === 0) {
        throw new Error('CSV file is empty');
      }

      const firstRow = csvData[0];
      if (!firstRow.name || !firstRow.image_path || !firstRow.layout_link) {
        throw new Error('CSV must have columns: name, image_path, layout_link');
      }

      // Process each row
      const basesToInsert = csvData.map(row => ({
        name: row.name,
        image_url: row.image_path,
        layout_link: row.layout_link,
        description: row.description || null,
        stats: row.stats || null,
        tips: row.tips || null,
        hall_type: hallType,
        hall_level: hallLevel,
        base_type: baseType,
        download_count: 0,
        average_rating: 0,
        rating_count: 0
      }));

      // Insert into database
      const { error } = await supabase
        .from('bases')
        .insert(basesToInsert);

      if (error) throw error;

      toast({
        title: "Upload Successful",
        description: `Successfully uploaded ${basesToInsert.length} bases.`,
      });

      setFile(null);
      // Reset form
      const fileInput = document.getElementById('csv-file') as HTMLInputElement;
      if (fileInput) fileInput.value = '';

    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload Failed",
        description: error instanceof Error ? error.message : "An error occurred during upload.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileSpreadsheet className="w-5 h-5" />
          Bulk CSV Upload
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="hall-type">Hall Type</Label>
            <Select value={hallType} onValueChange={(value) => setHallType(value as HallType)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="TH">Town Hall (TH)</SelectItem>
                <SelectItem value="BH">Builder Hall (BH)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="hall-level">Hall Level</Label>
            <Select value={hallLevel.toString()} onValueChange={(value) => setHallLevel(parseInt(value))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {hallType === 'TH' ? (
                  Array.from({ length: 15 }, (_, i) => i + 3).map(level => (
                    <SelectItem key={level} value={level.toString()}>TH{level}</SelectItem>
                  ))
                ) : (
                  Array.from({ length: 8 }, (_, i) => i + 3).map(level => (
                    <SelectItem key={level} value={level.toString()}>BH{level}</SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="base-type">Base Type</Label>
            <Select value={baseType} onValueChange={(value) => setBaseType(value as BaseType)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="WAR">War</SelectItem>
                <SelectItem value="FARMING">Farming</SelectItem>
                <SelectItem value="TROPHY">Trophy</SelectItem>
                <SelectItem value="HYBRID">Hybrid</SelectItem>
                <SelectItem value="CWL">CWL</SelectItem>
                <SelectItem value="FUN">Fun</SelectItem>
                <SelectItem value="PROGRESS_BASE">Progress Base</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="csv-file">CSV File</Label>
          <Input
            id="csv-file"
            type="file"
            accept=".csv"
            onChange={handleFileSelect}
          />
          <p className="text-sm text-muted-foreground mt-2">
            CSV should have columns: name, image_path, layout_link, description (optional), stats (optional), tips (optional)
          </p>
        </div>

        {file && (
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm">
              <strong>Selected file:</strong> {file.name}
            </p>
            <p className="text-sm text-muted-foreground">
              Ready to upload to {hallType}{hallLevel} {baseType} bases
            </p>
          </div>
        )}

        <Button 
          onClick={processCSV} 
          disabled={!file || isUploading}
          className="w-full"
        >
          <Upload className="w-4 h-4 mr-2" />
          {isUploading ? 'Uploading...' : 'Upload CSV'}
        </Button>
      </CardContent>
    </Card>
  );
}