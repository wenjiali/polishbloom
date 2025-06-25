# Polish & Bloom Website

This is the official website for Polish & Bloom, a self-help and financial wellness space for women who want clarity, confidence, and cashflow.

## 🚀 Running Locally

To view the website on your local machine, you can simply open the `index.html` file in your web browser.

For a more realistic development environment, you can use a local web server. If you have Python installed, you can run the following command in the project root:

```bash
python -m http.server
```

Alternatively, you can use `npx` to run a live server:

```bash
npx live-server
```

## 🌐 Deployment

This project is configured for easy deployment to [Vercel](https://vercel.com/).

1.  **Install the Vercel CLI:**
    ```bash
    npm install -g vercel
    ```

2.  **Deploy to Production:**
    From the project's root directory, run the following command:
    ```bash
    vercel --prod
    ```

## Linting

This project uses [Biome](https://biomejs.dev/) for linting and formatting. To check the code, run:
`npx @biomejs/biome check ./`

To apply formatting and fixes:
`npx @biomejs/biome check --apply ./` 

