import APIFeatures from "@/components/api/APIFeatures";
import APIRegistrationForm from "@/components/api/APIRegistrationForm";
import APIInfo from "@/components/api/APIInfo";
import APIFooterInfo from "@/components/api/APIFooterInfo";

const API = () => {
  return (
    <div className="container mx-auto px-4 pt-24 pb-12 max-w-4xl">
      <h1 className="text-4xl font-bold text-center mb-6">Tradenly API Access</h1>
      
      <p className="text-center text-lg mb-12 text-muted-foreground">
        We are excited to offer developers, traders, and businesses the opportunity to integrate with Tradenly's
        powerful trading platform. By signing up for early access, you'll be among the first to leverage our APIs when
        they launch.
      </p>

      <APIInfo />
      <APIFeatures />
      <APIRegistrationForm />
      <APIFooterInfo />
    </div>
  );
};

export default API;