import LoginComponent from "@/components/forms/login";


export default function LoginPage() {
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <div className="inline-block max-w-lg text-center justify-center">
        <LoginComponent />
      </div>
    </section>
  );
}
