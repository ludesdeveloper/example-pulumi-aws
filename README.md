# **EXAMPLE PULUMI FOR AWS**
### **Infrastructure Design**
![Infrastructure Design](images/Pulumi-Black.png)
### **How To**
1. Set region (change region base on your need)
```
pulumi config set aws:region ap-southeast-3
```
2. Install package needed
```
npm install
```
3. Generate keypair
```
ssh-keygen -f keypair
```
4. Create infrastructure with pulumi 
```
pulumi up
```
5. Make sure instance already in Ok status
6. Test your web application
```
curl $(pulumi stack output outputInstancePublicIp)
```
5. 

