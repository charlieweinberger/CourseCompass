"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { useUser } from "@auth0/nextjs-auth0/client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Upload, FileText, X } from "lucide-react";

export default function NewCourse() {
  const [courseTitle, setCourseTitle] = useState("");
  const [courseCode, setCourseCode] = useState("");
  const [term, setTerm] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);

  const hiddenFileInput = useRef<HTMLInputElement>(null);
  const { user, isLoading } = useUser();

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="flex justify-center p-8">
        <p>Please log in to upload a file.</p>
      </div>
    );
  }

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

    // send file to server
    const formData = new FormData();
    formData.append("courseTitle", courseTitle);
    formData.append("courseCode", courseCode);
    formData.append("term", term);
    formData.append("file", file);
    fetch("/api/new-course", {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Course created successfully:", data);
        setUploadComplete(true);
        
        // Redirect to the course page after a short delay
        setTimeout(() => {
          // Get the current URL and port
          const currentUrl = window.location.origin;
          // Ensure we're using the correct plural 'courses' path
          window.location.href = `${currentUrl}/courses/${data.course.id}`;
        }, 1500);
      })
      .catch((error) => {
        console.error("Error creating course:", error);
      })
      .finally(() => {
        setIsUploading(false);
        setTimeout(() => {
          setUploadComplete(false);
          removeFile();
        }, 10000);
      });
  };

  return (
    <div className="container py-12">
      <div className="mb-8">
        <Link
          href="/dashboard"
          className="inline-flex items-center text-compass-blue hover:text-compass-blue-dark"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          <span>Back to Dashboard</span>
        </Link>
      </div>

      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="font-bold tracking-tight text-3xl mb-2">
            Create Course
          </h1>
          <p className="text-gray-600">
            Our AI will analyze your syllabus to create a personalized study
            plan
          </p>
        </div>

        <Card className="w-full">
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
                        <SelectItem value="fall2024">Fall 2024</SelectItem>
                        <SelectItem value="winter2025">Winter 2025</SelectItem>
                        <SelectItem value="spring2025">Spring 2025</SelectItem>
                        <SelectItem value="summer2025">Summer 2025</SelectItem>
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
                            <p className="font-medium text-gray-900">
                              {file.name}
                            </p>
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
        </Card>
      </div>
    </div>
  );
}
