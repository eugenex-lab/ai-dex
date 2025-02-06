import { motion } from "framer-motion";

const About = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col-reverse lg:flex-row items-center gap-12">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="flex-1 text-center lg:text-left"
            >
              <h1 className="text-4xl lg:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400">
                About Tradenly
              </h1>
              <p className="text-lg text-muted-foreground mb-8">
                The future of crypto trading is here.
              </p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="flex-1"
            >
              <img 
                src="/lovable-uploads/e56ce89a-35b2-402d-9e41-c2ffbcd47790.png"
                alt="Tradenly Robot"
                className="w-full max-w-[500px] mx-auto"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Description Section */}
      <section className="py-16 bg-secondary/10">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-lg mb-8">
              Tradenly is a trailblazing team dedicated to creating innovative cryptocurrency trading
              bots and platforms. Specializing in Telegram and Discord bot development, we offer
              solutions for trading on Solana, Base, Tron, Cardano, Ethereum, and Binance.
            </p>
            <p className="text-lg mb-8">
              Our vision extends beyond bots: we are building a multichain trading platform designed
              to empower traders with automated tools that simplify and enhance the trading
              experience.
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16">Professionalism at its' peak</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="glass-card p-8 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Trading Made Simple</h3>
              <p className="text-muted-foreground">
                At Tradenly, we don't just build bots – we build trust. With a commitment to innovation, security,
                and user-friendly designs, we're here to transform the way you trade in the world of cryptocurrency.
              </p>
            </div>
            <div className="glass-card p-8 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Founding Principles</h3>
              <p className="text-muted-foreground">
                Founded by a passionate and driven community, Tradenly is built on the expertise of dedicated
                developers with years of experience in blockchain and AI. Our mission is to empower traders with
                cutting-edge automation and deliver a future-ready, multichain trading platform.
              </p>
            </div>
            <div className="glass-card p-8 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Advanced tech</h3>
              <p className="text-muted-foreground">
                At Tradenly, we're redefining the future of crypto trading with innovative solutions built for the
                modern trader. Our team creates powerful tools for seamless trading across Solana, Ethereum, Binance,
                Cardano, Base, and Tron.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-secondary/10">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Our Team</h2>
          <div className="max-w-3xl mx-auto">
            <p className="text-lg text-center mb-8">
              At Tradenly, we've spent months assembling a team of the brightest minds in the web3 space,
              with a special focus on the Cardano ecosystem. Recognizing the power of collaboration,
              we've formed an esteemed advisory council composed of thought leaders and innovators
              from across the blockchain world.
            </p>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Our Vision</h2>
          <div className="max-w-3xl mx-auto">
            <p className="text-lg text-center glass-card p-8 rounded-lg">
              Tradenly isn't just a project; it's a movement to push the boundaries of what's possible
              in decentralized finance. Together, we're building the future of crypto trading.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;