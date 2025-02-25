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
    <section className="py-24 ">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Card className="relative w-full h-full flex flex-col md:flex-row glass-card p-6 gap-6">
          {/* Contact Form Section */}
          <div className="w-full md:w-1/2 order-1 md:order-2 ">
            <h2 className="text-4xl font-semibold leading-10 mb-8">
              Send Us A Message
            </h2>
            <ContactForm />
          </div>

          {/* Image Section with Social Links */}
          <div className="w-full md:w-1/2 relative order-2 md:order-1 rounded-xl">
            <img
              src="https://img.freepik.com/free-vector/artificial-intelligence-isometric-ai-robot-mobile-phone-screen-chatbot-app_39422-767.jpg?t=st=1740485004~exp=1740488604~hmac=69f79f83dac52b49a285e5592e92d2b4aac7c574b9777615ce9bfb770fd29db7&w=996"
              alt="Contact"
              className="w-full h-full object-cover rounded-xl"
            />
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 p-6 lg:p-11 bg-white/90 backdrop-blur rounded-lg w-3/4">
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
        </Card>

        {/* Bottom decorative SVG elements */}
        <div className="relative">
          {/* First SVG */}
          <svg
            className="hidden sm:block absolute bottom-0 right-0 -mr-40 lg:mr-0"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 645.06 372.73"
          >
            <defs>
              <radialGradient
                id="a"
                cx="416.96"
                cy="273.37"
                r="226.21"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0" stopColor="#6e3f63" />
                <stop offset=".15" stopColor="#633d62" />
                <stop offset=".41" stopColor="#473660" />
                <stop offset=".5" stopColor="#3b335f" />
                <stop offset=".6" stopColor="#38315c" stopOpacity=".88" />
                <stop offset=".76" stopColor="#302b55" stopOpacity=".57" />
                <stop offset=".97" stopColor="#242249" stopOpacity=".07" />
                <stop offset="1" stopColor="#222147" stopOpacity="0" />
              </radialGradient>
            </defs>
            {/* SVG path data */}
            {/* Note: The full SVG path data has been omitted for brevity */}
          </svg>

          {/* Second SVG */}
          <svg
            className="absolute left-0 bottom-0 w-full h-full"
            xmlns="http://www.w3.org/2000/svg"
            xlink="http://www.w3.org/1999/xlink"
            viewBox="0 0 662.41 385.07"
            preserveAspectRatio="xMinYMax slice"
          >
            <defs>
              <radialGradient
                id="a"
                cx="368.69"
                cy="333.92"
                r="259.84"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0" stopColor="#d37575" />
                <stop offset=".99" stopColor="#58448b" stopOpacity="0" />
              </radialGradient>
              <radialGradient
                id="c"
                cx="2758.74"
                cy="334.46"
                r="259.84"
                gradientTransform="matrix(-1 0 0 1 3280.52 0)"
                xlinkHref="#a"
              />
              <clipPath id="b">
                <path fill="none" d="M0 0h662.41v385.07H0z" />
              </clipPath>
            </defs>
            {/* SVG path data */}
            {/* Note: The full SVG path data has been omitted for brevity */}
          </svg>
        </div>
      </div>
    </section>
  );
};

export default Contact;
