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
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg">{reviewer.title}</CardTitle>
          <Badge variant="secondary">Grade {reviewer.gradeLevel}</Badge>
        </div>
        <CardDescription className="flex items-center gap-2">
          <FileText className="h-4 w-4" />
          {reviewer.subject}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-2">
          {reviewer.description}
        </p>
        <p className="text-xs text-muted-foreground">
          {reviewer.fileName}
        </p>
      </CardContent>
      <CardFooter>
        <Button onClick={handleDownload} className="w-full">
          <Download className="mr-2 h-4 w-4" />
          Download
        </Button>
      </CardFooter>
    </Card>
  );
}
