## Setup Virtual Repo

Once we move our reusables to GitHub and make it open source, our internal team need to take the code from GitHub and set it up, to avoid any issues working with 2 code bases we have automated this. This script will be added as a part of postinstall script. You can run this manually too using below command

```bash
npm run setup:virtualrepo
```

## NOTES

- To be consumed with an application using strict mode
