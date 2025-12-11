import { Grid } from "@mui/material";
import StatCard from "./StatCard";

export default function StatsGrid({ stats = [] }) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <Grid
      container
      spacing={3}
      component={require("framer-motion").motion.div}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      {stats.map((stat, i) => (
        <Grid item xs={12} sm={6} md={3} key={i}>
          <StatCard
            icon={stat.icon}
            value={stat.value}
            label={stat.label}
            color={stat.color}
            actionText={stat.actionText}
            onAction={stat.onAction}
          />
        </Grid>
      ))}
    </Grid>
  );
}
