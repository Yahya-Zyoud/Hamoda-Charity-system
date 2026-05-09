import { motion } from "framer-motion";

export const StatCard = ({ stat, index }) => {
  const Icon = stat.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="flex flex-col items-center justify-center text-center group"
    >
      <div
        className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl ${stat.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
      >
        <Icon className={`w-8 h-8 md:w-10 md:h-10 ${stat.color}`} strokeWidth={1.5} />
      </div>

      <div className="space-y-1">
        <p className={`text-2xl md:text-3xl font-black ${stat.color} tabular-nums`}>
          {stat.value.toLocaleString('ar-SA')}{stat.suffix}
        </p>
        <p className="text-slate-600 font-medium text-sm md:text-base leading-tight">
          {stat.name}
        </p>
      </div>
    </motion.div>
  );
};

export default StatCard;