import { reddit_mono } from "@/lib/ui/fonts";

export default function Page() {
  return (
    <div
      className={`flex flex-col w-full h-full items-center justify-between p-24 ${reddit_mono.className}`}
    >
      <header className="w-full max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-8">Welcome to Our Website</h1>
      </header>
      <section className="w-full max-w-4xl mx-auto text-center mb-16">
        <h2 className="text-2xl font-semibold mb-4">About Us</h2>
        <p className="text-lg">
          Welcome to our website, where we strive to bring you the best content and services. Our team is dedicated to providing high-quality experiences tailored to your needs. We are passionate about what we do and are committed to excellence.
        </p>
      </section>
      <section className="w-full max-w-4xl mx-auto text-center mb-16">
        <h2 className="text-2xl font-semibold mb-4">Our Services</h2>
        <p className="text-lg">
          We offer a wide range of services designed to cater to various interests and needs. From in-depth articles and insightful guides to personalized support and community engagement, we have something for everyone. Our goal is to make sure you have the best experience possible.
        </p>
      </section>
    </div>
  );
}