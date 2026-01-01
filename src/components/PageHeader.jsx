import { motion } from 'framer-motion';

export default function PageHeader({ title, subtitle, right }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mb-6 flex items-center justify-between gap-4"
    >
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 via-cyan-400 to-blue-500">
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm text-gray-400 mt-1">{subtitle}</p>
        )}
      </div>
      {right && <div className="flex-shrink-0">{right}</div>}
    </motion.div>
  );
}
