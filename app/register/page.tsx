import RegisterComponent from "@/components/forms/register";
import { PageLayout } from "@/components/layouts/pageLayout";

export default function RegistrationPage() {
  return (
    <PageLayout showNav={false}>
      <RegisterComponent />
    </PageLayout>
  );
}
