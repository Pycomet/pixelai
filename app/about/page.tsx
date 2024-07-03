import { PageLayout } from "@/components/layouts/pageLayout";
import { title } from "@/components/primitives";

export default function AboutPage() {
  return (
    <PageLayout showNav={true}>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="inline-block max-w-lg text-center justify-center">
          <h1 className={title()}>About</h1>
        </div>
      </section>
    </PageLayout>
  );
}
