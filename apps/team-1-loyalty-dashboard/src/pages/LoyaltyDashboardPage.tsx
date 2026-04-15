import type { CSSProperties } from "react";
import { Card, Grid, KpiCard, PageHeader } from "@voyado-kth/ui";
import teamData from "../../data/team.json";
import { getDashboardKpis, getDashboardSummary } from "../lib/dashboardData";
import styles from "./LoyaltyDashboardPage.module.css";

const sectionPlaceholders = [
  {
    title: "KPI Summary Row",
    description:
      "The top summary band for key loyalty signals and trend movement.",
  },
  {
    title: "Tier Distribution",
    description:
      "A visual snapshot of how members are spread across loyalty tiers.",
  },
  {
    title: "Recent Activity",
    description: "A chronological feed of the latest points and tier events.",
  },
  {
    title: "Enrollment Trend",
    description:
      "A chart-ready area for monthly enrollment momentum over time.",
  },
  {
    title: "Top Members",
    description:
      "A leaderboard section reserved for the stretch-goal table view.",
  },
];

export function LoyaltyDashboardPage() {
  const dashboardSummary = getDashboardSummary();
  const dashboardKpis = getDashboardKpis();

  return (
    <main className={styles.page}>
      <section
        className={styles.heroSection}
        aria-label="Loyalty dashboard overview"
      >
        <Card className={styles.heroCard}>
          <div className={styles.heroAccent} aria-hidden="true" />
          <div className={styles.heroContent}>
            <PageHeader
              title="Program health at a glance"
              subtitle="A desktop-first dashboard shell for fast morning check-ins, weekly reporting, and scannable loyalty insights."
            />
            <div className={styles.heroBody}>
              <p className={styles.heroLead}>
                This first story replaces the empty state with a structured
                dashboard canvas, giving the team a strong visual foundation for
                the KPI row, charts, and activity components coming next.
              </p>
              <div
                className={styles.signalRow}
                aria-label="Planned dashboard signals"
              >
                {dashboardSummary.signalPills.map((signal) => (
                  <span key={signal} className={styles.signalPill}>
                    {signal}
                  </span>
                ))}
              </div>

              <section
                className={styles.kpiSection}
                aria-labelledby="kpi-summary-heading"
              >
                <h3
                  id="kpi-summary-heading"
                  className={styles.kpiSectionHeading}
                >
                  KPI summary
                </h3>
                <Grid
                  columns="repeat(auto-fit, minmax(220px, 1fr))"
                  gap="var(--ess-spacing-400)"
                  className={styles.kpiGrid}
                >
                  {dashboardKpis.map((metric) => (
                    <KpiCard
                      key={metric.label}
                      label={metric.label}
                      value={metric.formattedValue}
                      trend={metric.trend}
                      trendValue={
                        metric.trendPercentage === 0
                          ? "0%"
                          : `${metric.trend === "down" ? "-" : "+"}${metric.trendPercentage}%`
                      }
                    />
                  ))}
                </Grid>
              </section>
            </div>
          </div>
        </Card>

        <Card className={styles.teamCard}>
          <div className={styles.teamCardHeader}>
            <p className={styles.eyebrow}>Workshop team</p>
            <h2 className={styles.teamTitle}>{teamData.teamName}</h2>
          </div>
          <ul className={styles.memberList}>
            {teamData.members.map((member) => (
              <li key={member.id} className={styles.memberItem}>
                <span
                  className={styles.memberInitials}
                  style={{ "--member-color": member.color } as CSSProperties}
                >
                  {member.initials}
                </span>
                <div className={styles.memberMeta}>
                  <p className={styles.memberName}>{member.name}</p>
                  <p className={styles.memberRole}>{member.role}</p>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </section>

      <section
        className={styles.sectionGrid}
        aria-labelledby="planned-sections-heading"
      >
        <div className={styles.sectionIntro}>
          <p className={styles.eyebrow}>Dashboard structure</p>
          <h2 id="planned-sections-heading" className={styles.sectionHeading}>
            Planned sections
          </h2>
          <p className={styles.sectionDescription}>
            The placeholders below map directly to the implementation backlog,
            so each upcoming story can slot into a clearly defined surface area.
          </p>
        </div>

        {sectionPlaceholders.map((section) => (
          <Card
            key={section.title}
            className={styles.placeholderCard}
            hoverable
          >
            <p className={styles.cardLabel}>Placeholder</p>
            <h3 className={styles.cardTitle}>{section.title}</h3>
            <p className={styles.cardDescription}>{section.description}</p>
            <p className={styles.cardMeta}>
              {dashboardSummary.sectionStats[section.title]}
            </p>
            <div className={styles.placeholderBars} aria-hidden="true">
              <span className={styles.placeholderBarWide} />
              <span className={styles.placeholderBarMedium} />
              <span className={styles.placeholderBarShort} />
            </div>
          </Card>
        ))}
      </section>
    </main>
  );
}
