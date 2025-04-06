import { Card, CardContent } from "@/components/ui/card";

const privacyPoints = [
  {
    title: "1. Information We Collect",
    content: "Course Compass collects information that you provide directly to us when you create an account, update your profile, use interactive features, fill out a form, or otherwise communicate with us. This may include your name, email address, academic information, and course history."
  },
  {
    title: "2. How We Use Your Information",
    content: "We use the information we collect to provide, maintain, and improve our services, such as to personalize course recommendations and academic planning assistance. We may also use the information to communicate with you about updates, respond to your comments and questions, and provide customer service."
  },
  {
    title: "3. Data Security",
    content: "We implement reasonable security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security."
  },
  {
    title: "4. Data Sharing",
    content: "We do not sell your personal information to third parties. We may share your information with third-party service providers who perform services on our behalf, such as hosting, data analysis, and customer service. These service providers are bound by contractual obligations to keep personal information confidential."
  },
  {
    title: "5. Your Rights",
    content: "You may update, correct, or delete your personal information at any time by accessing your account settings. You may also request access to your personal information or request that we restrict processing of your personal information."
  },
  {
    title: "6. Changes to This Privacy Policy",
    content: "We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the \"Last updated\" date."
  },
  {
    title: "7. Contact Us",
    content: "If you have any questions about this Privacy Policy, please contact us at privacy@coursecompass.com."
  }
];

export default function Privacy() {
  return (
    <div className="container mx-auto py-16 px-4">
      <Card className="p-6 rounded-lg shadow-md">
        <CardContent className="p-2">
          <h1 className="text-3xl font-bold text-primary mb-2">
            Privacy Policy
          </h1>

          <p className="text-sm text-muted-foreground mb-8">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          {privacyPoints.map((point, index) => (
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
