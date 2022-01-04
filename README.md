# **EXAMPLE PULUMI FOR AWS**
### **Design**
![Design Architecture](images/Pulumi-Black.png)
### **How To**
1. Create infrastructure with pulumi 
```
pulumi up
```
2. Set region (change region base on your need)
```
pulumi config set aws:region ap-southeast-3
```
3. Make sure instance already in Ok status
4. Test your web application
```
curl $(pulumi stack output outputInstancePublicIp)
```
5. 

