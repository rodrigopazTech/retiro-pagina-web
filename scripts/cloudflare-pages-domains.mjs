import fs from "node:fs";

const configPath =
  "C:/Users/Rodrigo.DESKTOP-2MLHEH3/AppData/Roaming/xdg.config/.wrangler/config/default.toml";
const accountId = "24a4458e11fc84a317b5d20cff165980";
const projectName = "retiro-pagina-web";
const targetDomains = ["kairosvicentino.org", "www.kairosvicentino.org"];

const config = fs.readFileSync(configPath, "utf8");
const token = config.match(/^oauth_token\s*=\s*"([^"]+)"/m)?.[1];

if (!token) {
  throw new Error("No oauth_token found in Wrangler config.");
}

const baseUrl = `https://api.cloudflare.com/client/v4/accounts/${accountId}/pages/projects/${projectName}/domains`;
const headers = {
  Authorization: `Bearer ${token}`,
  "Content-Type": "application/json",
};

async function request(method, url, body) {
  const response = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const json = await response.json().catch(() => ({}));
  return { status: response.status, json };
}

function summarizeDomain(domain) {
  return {
    name: domain.name,
    status: domain.status,
    validation_data: domain.validation_data,
    verification_data: domain.verification_data,
  };
}

const before = await request("GET", baseUrl);
if (!before.json.success) {
  console.log(JSON.stringify({ step: "list-before", status: before.status, errors: before.json.errors }, null, 2));
  process.exit(1);
}

console.log(
  JSON.stringify(
    { existing_domains: before.json.result.map(summarizeDomain) },
    null,
    2,
  ),
);

for (const name of targetDomains) {
  const exists = before.json.result.some((domain) => domain.name === name);
  if (exists) {
    console.log(JSON.stringify({ action: "already-attached", name }, null, 2));
    continue;
  }

  const added = await request("POST", baseUrl, { name });
  console.log(
    JSON.stringify(
      {
        action: "add-domain",
        name,
        status: added.status,
        success: added.json.success,
        errors: added.json.errors,
        result: added.json.result ? summarizeDomain(added.json.result) : undefined,
      },
      null,
      2,
    ),
  );
}

const after = await request("GET", baseUrl);
console.log(
  JSON.stringify(
    {
      final_domains: after.json.success
        ? after.json.result.map(summarizeDomain)
        : [],
      errors: after.json.errors,
    },
    null,
    2,
  ),
);
