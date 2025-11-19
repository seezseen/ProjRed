import { Reviewer } from "@/app/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Download, FileText } from "lucide-react";

interface ReviewerCardProps {
  reviewer: Reviewer;
}

export function ReviewerCard({ reviewer }: ReviewerCardProps) {
  function handleDownload() {
    const url = `/api/files/${reviewer.fileKey}`;
    window.open(url, "_blank");
  }

  return (
    <Card className="group hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 border-2 hover:border-primary/20 animate-fadeIn">
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg group-hover:text-primary transition-colors duration-300">
            {reviewer.title}
          </CardTitle>
          <Badge 
            variant="secondary" 
            className="transition-all duration-300 group-hover:scale-110 group-hover:shadow-md"
          >
            Grade {reviewer.gradeLevel}
          </Badge>
        </div>
        <CardDescription className="flex items-center gap-2 group-hover:text-foreground/80 transition-colors">
          <FileText className="h-4 w-4 transition-transform duration-300 group-hover:rotate-12" />
          {reviewer.subject}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-2 transition-colors duration-300 group-hover:text-foreground/70">
          {reviewer.description}
        </p>
        <p className="text-xs text-muted-foreground transition-colors duration-300">
          {reviewer.fileName}
        </p>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleDownload} 
          className="w-full transition-all duration-300 hover:shadow-lg hover:scale-105 active:scale-95"
        >
          <Download className="mr-2 h-4 w-4 transition-transform duration-300 group-hover:translate-y-0.5" />
          Download
        </Button>
      </CardFooter>
    </Card>
  );
}
