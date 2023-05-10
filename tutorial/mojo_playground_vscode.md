# Connect to the Mojo playground from VS Code
## Getting the Jupyter URL
If you don't have access to the Mojo playground you'll need to [Sign up to the waitlist here](https://www.modular.com/get-started)

Open the link to your playground via your email from Modular and copy down the address in the browser, leaving out everything after `/lab`:

```
https://playground.modular.com/user/<email_address>/lab
```

[Generate a token here](https://playground.modular.com/hub/token), noting it down somewhere safe.

Add it to the end of your url like this (change the email address and token):

```
https://playground.modular.com/user/bob@gmail.com/lab/?token=750000000000000000000000ab
```

## VS Code
Install the [Jupyter VS Code extension](https://marketplace.visualstudio.com/items?itemName=ms-toolsai.jupyter)

From the command pallette (`ctrl+shift+p` or `shift+command+p`) select `Create: New Jupyter Notebook`

Then select `Notebook: Select Notebook Kernel` and follow the options:

`Select another kernel` > `Existing Jupyter Server` > `Enter the URL of a running Jupyter Server`

Now try writing some code and running a cell!


## Tips
Every time you want to use it, you'll need to start the server from your browser, you can use to url you created e.g.

```bash
open 'https://playground.modular.com/user/bob@gmail.com/lab/?token=750000000000000000000000ab'
```

