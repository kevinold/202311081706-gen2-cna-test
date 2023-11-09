import * as cdk from 'aws-cdk-lib';
import * as backup from 'aws-cdk-lib/aws-backup';
import * as events from 'aws-cdk-lib/aws-events';
import * as rds from 'aws-cdk-lib/aws-rds';
import { Construct } from 'constructs';

/**
 * Define the stack's props
 */
export type BackupStackProps = cdk.StackProps & {
  /**
   * Database instance to back up
   */
  database: rds.DatabaseInstance;
};

/**
 * Configure an "BackupStack" to backup DynamoDB Tables created by `data`
 */
export class BackupStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: BackupStackProps) {
    super(scope, id, props);

    const { database } = props;

    // create the backup plan
    const plan = new backup.BackupPlan(this, 'BackupPlan', {
      backupPlanRules: [
        new backup.BackupPlanRule({
          completionWindow: cdk.Duration.hours(2),
          startWindow: cdk.Duration.hours(1),
          scheduleExpression: events.Schedule.cron({
            day: '15',
            hour: '3',
            minute: '30',
          }),
          moveToColdStorageAfter: cdk.Duration.days(30),
        }),
      ],
    });

    // add the database to the backup plan
    plan.addSelection('Selection', {
      resources: [backup.BackupResource.fromRdsDatabaseInstance(database)],
    });
  }
}