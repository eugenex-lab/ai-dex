import ContactForm from "@/components/contact/ContactForm";

const Contact = () => {
  return (
    <div className="container mx-auto pt-24 pb-12">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">Contact Us</h1>
        <div className="glass-card p-8 rounded-lg">
          <ContactForm />
        </div>
      </div>
    </div>
  );
};

export default Contact;
