"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload, FileText, X } from "lucide-react";

export default function UploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [courseTitle, setCourseTitle] = useState("");
  const [courseCode, setCourseCode] = useState("");
  const [term, setTerm] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);

  const hiddenFileInput = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    hiddenFileInput.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const removeFile = () => {
    setFile(null);
    if (hiddenFileInput.current) {
      hiddenFileInput.current.value = "";
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setIsUploading(true);

    // TODO handle file upload logic here
    // Simulate file upload
    setTimeout(() => {
      setIsUploading(false);
      setUploadComplete(true);
      console.log("File uploaded:", { file, courseTitle, courseCode, term });
    }, 2000);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Upload Course Syllabus</CardTitle>
        <CardDescription>
          Upload your course syllabus and our AI will analyze it to create a
          personalized study plan
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="course-title">Course Title</Label>
              <Input
                id="course-title"
                placeholder="e.g. Introduction to Computer Science"
                value={courseTitle}
                onChange={(e) => setCourseTitle(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="course-code">Course Code</Label>
                <Input
                  id="course-code"
                  placeholder="e.g. CS101"
                  value={courseCode}
                  onChange={(e) => setCourseCode(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="term">Term</Label>
                <Select value={term} onValueChange={setTerm} required>
                  <SelectTrigger id="term">
                    <SelectValue placeholder="Select term" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fall2023">Fall 2023</SelectItem>
                    <SelectItem value="spring2024">Spring 2024</SelectItem>
                    <SelectItem value="summer2024">Summer 2024</SelectItem>
                    <SelectItem value="fall2024">Fall 2024</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Upload Syllabus</Label>
              <div
                className={`border-2 border-dashed rounded-lg p-6 ${
                  file
                    ? "border-compass-blue bg-compass-blue/5"
                    : "border-gray-200 hover:border-gray-300"
                } transition-colors cursor-pointer text-center`}
                onClick={handleClick}
              >
                <input
                  type="file"
                  ref={hiddenFileInput}
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx"
                  className="hidden"
                />

                {file ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-compass-blue/10 rounded-full">
                        <FileText className="h-5 w-5 text-compass-blue" />
                      </div>
                      <div className="text-left">
                        <p className="font-medium text-gray-900">{file.name}</p>
                        <p className="text-sm text-gray-500">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="p-1 rounded-full hover:bg-gray-200 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile();
                      }}
                    >
                      <X className="h-5 w-5 text-gray-500" />
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center space-y-2">
                    <div className="p-3 bg-gray-100 rounded-full">
                      <Upload className="h-6 w-6 text-gray-500" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-700">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-sm text-gray-500">
                        PDF, DOC, or DOCX (max 10MB)
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-compass-blue hover:bg-compass-blue-dark"
            disabled={
              isUploading || !file || !courseTitle || !courseCode || !term
            }
          >
            {isUploading
              ? "Uploading..."
              : uploadComplete
              ? "Upload Complete"
              : "Upload Syllabus"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="justify-center border-t px-6 py-4">
        <p className="text-sm text-gray-500">
          We&apos;ll analyze your syllabus to create a personalized study plan
          and find relevant resources
        </p>
      </CardFooter>
    </Card>
  );
}
