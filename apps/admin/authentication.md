# Authentication

Lightbug accounts provide access to all Lightbug interfaces and connected devices.


## Creating an Account

You can now create a Lightbug account directly through the admin portal.

To get started, open the admin portal, navigate to the [registration page](https://admin.lightbug.cloud/#/auth/register) and follow the account creation steps.

![Lightbug Admin portal account creation](https://i.imgur.com/7Fu00NW.png)

There are various password requirements to ensure account security, including minimum length, character variety, and a previous breach checker.

On successful account creation, you will be directed to the login page.

![Lightbug Admin portal account creation success](https://i.imgur.com/kYbF1jb.png)

### Sub Accounts

After creating your main account, you can add sub accounts to share device access with others from the admin portal.

For more details, see [adding new users to devices](/apps/admin/devices#add-new-user).

## Logging In

To log in to your Lightbug account, use the credentials you created during account setup.

First starting with the email address you registered with.

![Lightbug Admin portal login](https://i.imgur.com/xUAhQvi.png)

Once your email is entered, available login options will be displayed, most commonly password login.

![Lightbug Admin portal login options](https://i.imgur.com/s3yYBaN.png)

Select your preferred login method, and complete the login process.

### Password Login

If you choose password login, enter your password and click "Login".

![Lightbug Admin portal password login](https://i.imgur.com/gUHmrhg.png)

If you have forgotten your password, click the "[Forgot Password?](https://admin.lightbug.cloud/#/auth/request-password)" link to initiate a password reset.

## Permissions

All accounts can log in to the admin panel, however you will need to be granted permissions to access different features.

Different permissions will reveal different interfaces in the side bar, as well as content throughout the admin portal.

| Page | user | trackerAdmin |Description |
| -- | -- | -- | -- |
| [Devices](./devices.html) | ✅ | ✅ |List all devices on the account|
| [Configs](./configs.html) | |✅  |Manage `config pages` that can be applied to devices|
| [Users](./users.html) | |✅ |Manage sub users of your account|
