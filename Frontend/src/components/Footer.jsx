import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.7 }}
      className="bg-gradient-to-t from-myDarkPurple via-[#311b92] to-[#355cb1] text-white py-6 px-4 text-center  border-t border-white/10"
    >
      <p className="text-sm sm:text-base text-white/70">
        © {new Date().getFullYear()}{" "}
        <span className="text-white font-bold">Scar’s Game Store</span>. All
        rights reserved.
      </p>
    </motion.footer>
  );
}
