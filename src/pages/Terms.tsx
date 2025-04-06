import { Card, CardContent } from "@/components/ui/card";

const termsPoints = [
  {
    title: "1. Introduction",
    content: "Welcome to Course Compass. By accessing or using our service, you agree to be bound by these Terms. Please read these Terms carefully before using our platform."
  },
  {
    title: "2. Definitions",
    content: "\"Service\" refers to the Course Compass application, website, and all related services. \"User\" refers to students, faculty, and other individuals accessing our Service."
  },
  {
    title: "3. Account Registration",
    content: "To use certain features of our Service, you may need to register for an account. You agree to provide accurate information and to keep your account information updated. You are responsible for maintaining the confidentiality of your account credentials."
  },
  {
    title: "4. User Conduct",
    content: "You agree not to use the Service for any illegal purpose or in violation of any local, state, national, or international law. You agree not to upload or share content that infringes on intellectual property rights or contains harmful code."
  },
  {
    title: "5. Course Information",
    content: "Course Compass provides information about academic courses and programs. While we strive for accuracy, we do not guarantee that all information is complete or up-to-date. Users should verify critical information with their academic institution."
  },
  {
    title: "6. Data Privacy",
    content: "Our collection and use of personal information is governed by our Privacy Policy. By using our Service, you consent to our data practices as described in our Privacy Policy."
  },
  {
    title: "7. Intellectual Property",
    content: "The Service and its original content, features, and functionality are owned by Course Compass and are protected by copyright, trademark, and other intellectual property laws."
  },
  {
    title: "8. Termination",
    content: "We reserve the right to terminate or suspend your account and access to the Service immediately, without prior notice or liability, for any reason, including breach of these Terms."
  },
  {
    title: "9. Changes to Terms",
    content: "We reserve the right to modify or replace these Terms at any time. We will provide notice of significant changes through the Service. Your continued use of the Service after such changes constitutes your acceptance of the new Terms."
  },
  {
    title: "10. Contact Us",
    content: "If you have any questions about these Terms, please contact us at support@coursecompass.edu."
  }
]

export default function Privacy() {
  return (
    <div className="container mx-auto py-16 px-4">
      <Card className="p-6 rounded-lg shadow-md">
        <CardContent className="p-2">
          <h1 className="text-3xl font-bold text-primary mb-2">
            Terms of Service
          </h1>

          <p className="text-sm text-muted-foreground mb-8">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          {termsPoints.map((point, index) => (
            <div className="my-8" key={index}>
              <h2 className="text-xl font-semibold text-primary mb-3">
                {point.title}
              </h2>
              <p className="mb-4">{point.content}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
