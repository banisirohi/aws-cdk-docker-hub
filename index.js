"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ec2 = require("@aws-cdk/aws-ec2");
const ecs = require("@aws-cdk/aws-ecs");
const ecs_patterns = require("@aws-cdk/aws-ecs-patterns");
const cdk = require("@aws-cdk/core");
const secretsManager = require("@aws-cdk/aws-secretsmanager");
class BonjourECS extends cdk.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        // For better iteration speed, it might make sense to put this VPC into
        // a separate stack and import it here. We then have two stacks to
        // deploy, but VPC creation is slow so we'll only have to do that once
        // and can iterate quickly on consuming stacks. Not doing that for now.
        const vpc = new ec2.Vpc(this, 'MyVpc', { maxAzs: 2 });
        const cluster = new ecs.Cluster(this, 'Ec2Cluster', { vpc });
        cluster.addCapacity('DefaultAutoScalingGroup', {
            instanceType: ec2.InstanceType.of(ec2.InstanceClass.T2, ec2.InstanceSize.MICRO)
        });
        // Templated secret
        const templatedSecret = new secretsManager.Secret(this, 'TemplatedSecret', {
            generateSecretString: {
                secretStringTemplate: JSON.stringify({ username: '***', password: '***' }),
                generateStringKey: 'TemplatedSecretKey'
            },
            secretName: "banitestsecret"
        });
        // Instantiate ECS Service with just cluster and image
        const ecsService = new ecs_patterns.LoadBalancedEc2Service(this, "Ec2Service", {
            cluster,
            memoryLimitMiB: 512,
            image: ecs.ContainerImage.fromRegistry("reponame/testimagename", {
                credentials: templatedSecret
            }),
        });
        // Output the DNS where you can access your service
        new cdk.CfnOutput(this, 'LoadBalancerDNS', { value: ecsService.loadBalancer.loadBalancerDnsName });
    }
}
const app = new cdk.App();
new BonjourECS(app, 'Bonjour');
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHdDQUF5QztBQUN6Qyx3Q0FBeUM7QUFDekMsMERBQTJEO0FBQzNELHFDQUFzQztBQUN0Qyw4REFBK0Q7QUFFL0QsTUFBTSxVQUFXLFNBQVEsR0FBRyxDQUFDLEtBQUs7SUFDaEMsWUFBWSxLQUFjLEVBQUUsRUFBVSxFQUFFLEtBQXNCO1FBQzVELEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBRXhCLHVFQUF1RTtRQUN2RSxrRUFBa0U7UUFDbEUsc0VBQXNFO1FBQ3RFLHVFQUF1RTtRQUN2RSxNQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRSxFQUFFLE1BQU0sRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ3RELE1BQU0sT0FBTyxHQUFHLElBQUksR0FBRyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsWUFBWSxFQUFFLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztRQUM3RCxPQUFPLENBQUMsV0FBVyxDQUFDLHlCQUF5QixFQUFFO1lBQzdDLFlBQVksRUFBRSxHQUFHLENBQUMsWUFBWSxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLEVBQUUsRUFBRSxHQUFHLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQztTQUNoRixDQUFDLENBQUM7UUFFSCxtQkFBbUI7UUFDbkIsTUFBTSxlQUFlLEdBQUcsSUFBSSxjQUFjLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxpQkFBaUIsRUFBRTtZQUN6RSxvQkFBb0IsRUFBRTtnQkFDcEIsb0JBQW9CLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRSxDQUFDO2dCQUMxRSxpQkFBaUIsRUFBRSxvQkFBb0I7YUFDeEM7WUFDRCxVQUFVLEVBQUUsZ0JBQWdCO1NBQzdCLENBQUMsQ0FBQztRQUVILHNEQUFzRDtRQUN0RCxNQUFNLFVBQVUsR0FBRyxJQUFJLFlBQVksQ0FBQyxzQkFBc0IsQ0FBQyxJQUFJLEVBQUUsWUFBWSxFQUFFO1lBQzdFLE9BQU87WUFDUCxjQUFjLEVBQUUsR0FBRztZQUNuQixLQUFLLEVBQUUsR0FBRyxDQUFDLGNBQWMsQ0FBQyxZQUFZLENBQUMsa0JBQWtCLEVBQUU7Z0JBQ3pELFdBQVcsRUFBRSxlQUFlO2FBQzdCLENBQUM7U0FDSCxDQUFDLENBQUM7UUFFSCxtREFBbUQ7UUFDbkQsSUFBSSxHQUFHLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxpQkFBaUIsRUFBRSxFQUFFLEtBQUssRUFBRSxVQUFVLENBQUMsWUFBWSxDQUFDLG1CQUFtQixFQUFFLENBQUMsQ0FBQztJQUNyRyxDQUFDO0NBQ0Y7QUFFRCxNQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUUxQixJQUFJLFVBQVUsQ0FBQyxHQUFHLEVBQUUsU0FBUyxDQUFDLENBQUM7QUFFL0IsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGVjMiA9IHJlcXVpcmUoJ0Bhd3MtY2RrL2F3cy1lYzInKTtcbmltcG9ydCBlY3MgPSByZXF1aXJlKCdAYXdzLWNkay9hd3MtZWNzJyk7XG5pbXBvcnQgZWNzX3BhdHRlcm5zID0gcmVxdWlyZSgnQGF3cy1jZGsvYXdzLWVjcy1wYXR0ZXJucycpO1xuaW1wb3J0IGNkayA9IHJlcXVpcmUoJ0Bhd3MtY2RrL2NvcmUnKTtcbmltcG9ydCBzZWNyZXRzTWFuYWdlciA9IHJlcXVpcmUoJ0Bhd3MtY2RrL2F3cy1zZWNyZXRzbWFuYWdlcicpO1xuXG5jbGFzcyBCb25qb3VyRUNTIGV4dGVuZHMgY2RrLlN0YWNrIHtcbiAgY29uc3RydWN0b3Ioc2NvcGU6IGNkay5BcHAsIGlkOiBzdHJpbmcsIHByb3BzPzogY2RrLlN0YWNrUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQsIHByb3BzKTtcblxuICAgIC8vIEZvciBiZXR0ZXIgaXRlcmF0aW9uIHNwZWVkLCBpdCBtaWdodCBtYWtlIHNlbnNlIHRvIHB1dCB0aGlzIFZQQyBpbnRvXG4gICAgLy8gYSBzZXBhcmF0ZSBzdGFjayBhbmQgaW1wb3J0IGl0IGhlcmUuIFdlIHRoZW4gaGF2ZSB0d28gc3RhY2tzIHRvXG4gICAgLy8gZGVwbG95LCBidXQgVlBDIGNyZWF0aW9uIGlzIHNsb3cgc28gd2UnbGwgb25seSBoYXZlIHRvIGRvIHRoYXQgb25jZVxuICAgIC8vIGFuZCBjYW4gaXRlcmF0ZSBxdWlja2x5IG9uIGNvbnN1bWluZyBzdGFja3MuIE5vdCBkb2luZyB0aGF0IGZvciBub3cuXG4gICAgY29uc3QgdnBjID0gbmV3IGVjMi5WcGModGhpcywgJ015VnBjJywgeyBtYXhBenM6IDIgfSk7XG4gICAgY29uc3QgY2x1c3RlciA9IG5ldyBlY3MuQ2x1c3Rlcih0aGlzLCAnRWMyQ2x1c3RlcicsIHsgdnBjIH0pO1xuICAgIGNsdXN0ZXIuYWRkQ2FwYWNpdHkoJ0RlZmF1bHRBdXRvU2NhbGluZ0dyb3VwJywge1xuICAgICAgaW5zdGFuY2VUeXBlOiBlYzIuSW5zdGFuY2VUeXBlLm9mKGVjMi5JbnN0YW5jZUNsYXNzLlQyLCBlYzIuSW5zdGFuY2VTaXplLk1JQ1JPKVxuICAgIH0pO1xuXG4gICAgLy8gVGVtcGxhdGVkIHNlY3JldFxuICAgIGNvbnN0IHRlbXBsYXRlZFNlY3JldCA9IG5ldyBzZWNyZXRzTWFuYWdlci5TZWNyZXQodGhpcywgJ1RlbXBsYXRlZFNlY3JldCcsIHtcbiAgICAgIGdlbmVyYXRlU2VjcmV0U3RyaW5nOiB7XG4gICAgICAgIHNlY3JldFN0cmluZ1RlbXBsYXRlOiBKU09OLnN0cmluZ2lmeSh7IHVzZXJuYW1lOiAnKioqJywgcGFzc3dvcmQ6ICcqKionIH0pLFxuICAgICAgICBnZW5lcmF0ZVN0cmluZ0tleTogJ1RlbXBsYXRlZFNlY3JldEtleSdcbiAgICAgIH0sXG4gICAgICBzZWNyZXROYW1lOiBcImJhbml0ZXN0c2VjcmV0XCJcbiAgICB9KTtcblxuICAgIC8vIEluc3RhbnRpYXRlIEVDUyBTZXJ2aWNlIHdpdGgganVzdCBjbHVzdGVyIGFuZCBpbWFnZVxuICAgIGNvbnN0IGVjc1NlcnZpY2UgPSBuZXcgZWNzX3BhdHRlcm5zLkxvYWRCYWxhbmNlZEVjMlNlcnZpY2UodGhpcywgXCJFYzJTZXJ2aWNlXCIsIHtcbiAgICAgIGNsdXN0ZXIsXG4gICAgICBtZW1vcnlMaW1pdE1pQjogNTEyLFxuICAgICAgaW1hZ2U6IGVjcy5Db250YWluZXJJbWFnZS5mcm9tUmVnaXN0cnkoXCJvcmJpY2EvdGVzdG9yYmV4XCIsIHtcbiAgICAgICAgY3JlZGVudGlhbHM6IHRlbXBsYXRlZFNlY3JldFxuICAgICAgfSksXG4gICAgfSk7XG5cbiAgICAvLyBPdXRwdXQgdGhlIEROUyB3aGVyZSB5b3UgY2FuIGFjY2VzcyB5b3VyIHNlcnZpY2VcbiAgICBuZXcgY2RrLkNmbk91dHB1dCh0aGlzLCAnTG9hZEJhbGFuY2VyRE5TJywgeyB2YWx1ZTogZWNzU2VydmljZS5sb2FkQmFsYW5jZXIubG9hZEJhbGFuY2VyRG5zTmFtZSB9KTtcbiAgfVxufVxuXG5jb25zdCBhcHAgPSBuZXcgY2RrLkFwcCgpO1xuXG5uZXcgQm9uam91ckVDUyhhcHAsICdCb25qb3VyJyk7XG5cbmFwcC5zeW50aCgpO1xuIl19