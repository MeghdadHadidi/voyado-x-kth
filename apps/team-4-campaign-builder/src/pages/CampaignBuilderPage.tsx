import { ArrowRight, CalendarClock, MailPlus, Send, Sparkles } from 'lucide-react';
import { Button, Card, PageHeader } from '@voyado-kth/ui';
import styles from './CampaignBuilderPage.module.css';

const launchSteps = [
  {
    title: 'Choose a channel',
    description: 'Start with email, SMS, or push and keep the path focused from the first click.',
    icon: MailPlus,
  },
  {
    title: 'Shape the message',
    description: 'Guide content, preview personalization, and keep the narrative clear before launch.',
    icon: Sparkles,
  },
  {
    title: 'Schedule with confidence',
    description: 'Review the setup, confirm timing, and send the campaign flow into production mode.',
    icon: CalendarClock,
  },
];

export function CampaignBuilderPage() {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <PageHeader
          title="Campaign Builder"
          subtitle="Craft launch-ready journeys for email, SMS, and push with a setup that keeps campaign planning focused."
        >
          <Button type="button">
            Create Campaign
            <ArrowRight size={16} aria-hidden="true" />
          </Button>
        </PageHeader>

        <div className={styles.heroBody}>
          <div className={styles.heroCopy}>
            <span className={styles.kicker}>Team 4 workspace</span>
            <h2 className={styles.heroTitle}>From overview to send-ready campaign in one focused workspace.</h2>
            <p className={styles.heroText}>
              The first build lays out the command center: campaign surface on the left, creation runway on
              the right, and a visible path toward the full wizard flow.
            </p>

            <div className={styles.heroActions}>
              <Button type="button">Create Campaign</Button>
              <Button variant="ghost" type="button">
                Preview Workflow
              </Button>
            </div>
          </div>

          <Card className={styles.previewCard}>
            <div className={styles.previewHeader}>
              <span className={styles.previewEyebrow}>Launch rhythm</span>
              <span className={styles.previewPill}>Page shell</span>
            </div>

            <div className={styles.previewPanel}>
              <div className={styles.previewTrack} aria-hidden="true">
                <span className={styles.previewNode} />
                <span className={styles.previewLine} />
                <span className={styles.previewNode} />
                <span className={styles.previewLine} />
                <span className={styles.previewNode} />
              </div>

              <div className={styles.previewContent}>
                <p className={styles.previewLabel}>Up next</p>
                <h3 className={styles.previewTitle}>Campaign list, wizard steps, and live preview will land here.</h3>
                <p className={styles.previewText}>
                  This story replaces the placeholder with a real working shell so the team can build feature
                  stories in sequence.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      <section className={styles.grid}>
        <Card className={styles.featureCard}>
          <div className={styles.cardHeader}>
            <span className={styles.cardEyebrow}>Campaign runway</span>
            <Send size={18} aria-hidden="true" />
          </div>
          <h3 className={styles.cardTitle}>A sharp entry point for creation</h3>
          <p className={styles.cardText}>
            The primary action is already visible, giving the upcoming wizard a clear home without layering in
            extra logic too early.
          </p>
        </Card>

        <div className={styles.stepColumn}>
          {launchSteps.map(({ title, description, icon: Icon }, index) => (
            <Card key={title} className={styles.stepCard}>
              <div className={styles.stepIndex}>0{index + 1}</div>
              <div className={styles.stepBody}>
                <div className={styles.stepIcon}>
                  <Icon size={18} aria-hidden="true" />
                </div>
                <div>
                  <h3 className={styles.stepTitle}>{title}</h3>
                  <p className={styles.stepText}>{description}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}
