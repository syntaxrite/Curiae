// hello
import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { RIGHTS_CATEGORIES, COUNTRIES } from "@/lib/constants";
import { RightsCategoryView } from "@/components/rights-category-view";

type PageProps = {
  params: {
    country: string;
    category: string;
  };
};

export function generateStaticParams() {
  return COUNTRIES.flatMap((country) =>
    RIGHTS_CATEGORIES.map((category) => ({
      country: country.code,
      category: category.key
    }))
  );
}

export function generateMetadata({ params }: PageProps): Metadata {
  const country = COUNTRIES.find((item) => item.code === params.country)?.label ?? params.country;
  const category = RIGHTS_CATEGORIES.find((item) => item.key === params.category)?.label ?? params.category;
  return {
    title: `${category} rights in ${country} | Curiae`,
    description: `Plain-English rights guidance for ${category} in ${country}.`
  };
}

export default function RightsCategoryPage({ params }: PageProps) {
  return (
    <div className="min-h-screen bg-background text-text-primary">
      <Navbar />
      <main className="mx-auto w-full max-w-7xl px-6 py-12">
        <RightsCategoryView country={params.country} category={params.category} />
      </main>
      <Footer />
    </div>
  );
}
