---
title: Mojo Playground From VSCode
categories: General
usage: Connect VS Code to the Mojo Playground via the Jupyter Notebook extension
---

# Mojo playground from VS Code
### Getting the Jupyter URL
If you don't have access to the Mojo playground you'll need to [Sign up to the waitlist here](https://www.modular.com/get-started)

Open the link to your playground via your email from Modular and copy down the address in the browser, leaving out everything after your email address:

`https://playground.modular.com/user/<your_email>`

[Generate a token here](https://playground.modular.com/hub/token), noting it down somewhere safe.

Add it to the end of your url like this (change the email address and token):

```https://playground.modular.com/user/<your_email>/?token=<your_token>```

### VS Code
Install the [Jupyter VS Code extension](https://marketplace.visualstudio.com/items?itemName=ms-toolsai.jupyter)

From the command pallette (`ctrl+shift+p` or `shift+command+p`) select `Create: New Jupyter Notebook`

Then from the command pallette again select `Notebook: Select Notebook Kernel` and follow the options:

`Select another kernel` > `Existing Jupyter Server` > `Enter the URL of a running Jupyter Server`

It'll prompt for you to enter a server name, you can set it as `Mojo Playground` or whatever you like, then choose the Mojo kernel.

Now try writing some code and running a cell!


### Tips
Every time you want to use it, you'll need to start the server from your browser, you can the add the link without your username and it'll remember your session via cookies:

```bash
open 'https://playground.modular.com'
```

You'll likely need to restart the kernel at some point as bugs are ironed out, you can use:

Command Pallette > `Jupyter: Restart Kernel`

<CommentService />
