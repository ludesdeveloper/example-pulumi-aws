import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as fs from "fs";

const vpc = new aws.ec2.Vpc("vpc", {
    cidrBlock: "172.16.0.0/16",
    tags: {
        Name: "tf-example",
    },
});
const internetGateway = new aws.ec2.InternetGateway("internet-gateway", {
    vpcId: vpc.id,
    tags: {
        Name: "main",
    },
});
const subnet = new aws.ec2.Subnet("subnet", {
    vpcId: vpc.id,
    cidrBlock: "172.16.10.0/24",
    availabilityZone: "ap-southeast-3a",
    tags: {
        Name: "tf-example",
    },
});
const routeTable = new aws.ec2.RouteTable("route-table", {
    vpcId: vpc.id,
    routes: [
        {
            cidrBlock: "0.0.0.0/0",
            gatewayId: internetGateway.id,
        },
    ],
    tags: {
        Name: "example",
    },
});
const routeTableAssociation = new aws.ec2.RouteTableAssociation("route-table-RouteTableAssociation", {
    subnetId: subnet.id,
    routeTableId: routeTable.id,
});
export const outputRouteTableAssociation = routeTableAssociation.id
const ubuntu = aws.ec2.getAmi({
    mostRecent: true,
    filters: [
        {
            name: "name",
            values: ["ubuntu/images/hvm-ssd/ubuntu-focal-20.04-amd64-server-*"],
        },
        {
            name: "virtualization-type",
            values: ["hvm"],
        },
    ],
    owners: ["099720109477"],
});
const deployer = new aws.ec2.KeyPair("deployer", {
    publicKey: fs.readFileSync('./keypair.pub', 'utf8'),
});
const securityGroup = new aws.ec2.SecurityGroup("security-SecurityGroup", {
    description: "Allow inbound & outbound traffic",
    vpcId: vpc.id,
    ingress: [{
        description: "SSH",
        fromPort: 22,
        toPort: 22,
        protocol: "tcp",
        cidrBlocks: ["0.0.0.0/0"],
    },
    {
        description: "Web",
        fromPort: 80,
        toPort: 80,
        protocol: "tcp",
        cidrBlocks: ["0.0.0.0/0"],
    }],
    egress: [{
        fromPort: 0,
        toPort: 0,
        protocol: "-1",
        cidrBlocks: ["0.0.0.0/0"],
    }],
    tags: {
        Name: "allow-inbound-outbound",
    },
});
const instance = new aws.ec2.Instance("instance", {
    ami: ubuntu.then(ubuntu => ubuntu.id),
    instanceType: "t3.medium",
    keyName: deployer.keyName,
    securityGroups: [securityGroup.id],
    subnetId: subnet.id,
    privateIp: "172.16.10.30",
    associatePublicIpAddress: true,
    userData: fs.readFileSync('./install-docker.sh', 'utf8'),
}, { deleteBeforeReplace: true });
export const outputInstancePublicIp = instance.publicIp
