import ContactForm from "@/components/contact/ContactForm";
import { Card } from "@/components/ui/card";
import { Icon } from "@iconify/react";

const socialLinks = [
  {
    name: "X",
    href: "https://x.com/Tradenly",
    icon: <Icon icon="simple-icons:x" className="w-full h-full" />,
  },
  {
    name: "Discord",
    href: "#",
    icon: <Icon icon="simple-icons:discord" className="w-full h-full" />,
  },
  {
    name: "Medium",
    href: "https://medium.com/@tradenly",
    icon: <Icon icon="grommet-icons:medium" className="w-full h-full" />,
  },
];

const Contact = () => {
  return (
    <section className="py-24">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-5xl font-bold mb-10 text-center">Contact Us</h1>

        <Card className="relative w-full h-full flex flex-col md:flex-row glass-card p-6 gap-6 overflow-hidden">
          {/* Contact Form Section */}
          <div className="w-full md:w-1/2 order-1 md:order-2 relative z-20">
            <h2 className="text-4xl font-semibold leading-10 mb-8">
              Send Us A Message
            </h2>
            <ContactForm />
          </div>

          <div className="w-full md:w-1/2 relative order-2 md:order-1 rounded-xl z-20 h-32 md:h-auto">
            <img
              src="https://img.freepik.com/free-vector/artificial-intelligence-isometric-ai-robot-mobile-phone-screen-chatbot-app_39422-767.jpg?t=st=1740485004~exp=1740488604~hmac=69f79f83dac52b49a285e5592e92d2b4aac7c574b9777615ce9bfb770fd29db7&w=996"
              alt="Contact"
              className="w-full h-full object-cover rounded-xl"
            />
            <div className="absolute bottom-28 md:bottom-40 left-1/2 -translate-x-1/2 p-6 lg:p-11 bg-white/90 backdrop-blur rounded-lg w-3/4 glass-card">
              <div className="flex flex-row items-center justify-center gap-4">
                {socialLinks.map(({ name, href, icon }) => (
                  <a
                    key={name}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary transition-colors hover:text-primary/80"
                  >
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center p-2">
                      <div className="w-5 h-5 text-white">{icon}</div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
          {/* SVGs moved inside Card */}
          <div className="absolute inset-0 z-10">
            <svg
              className="hidden sm:block absolute bottom-0 right-0 -mr-40 lg:mr-0"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 645.06 372.73"
            >
              {/* First SVG content */}
            </svg>

            <svg
              className="absolute left-0 bottom-0 w-full h-full"
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              viewBox="0 0 662.41 385.07"
              preserveAspectRatio="xMinYMax slice"
            >
              {/* Second SVG content */}
            </svg>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default Contact;
