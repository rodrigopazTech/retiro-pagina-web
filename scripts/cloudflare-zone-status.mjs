import fs from "node:fs";

const configPath =
  "C:/Users/Rodrigo.DESKTOP-2MLHEH3/AppData/Roaming/xdg.config/.wrangler/config/default.toml";
const domain = "kairosvicentino.org";

const config = fs.readFileSync(configPath, "utf8");
const token = config.match(/^oauth_token\s*=\s*"([^"]+)"/m)?.[1];

if (!token) {
  throw new Error("No oauth_token found in Wrangler config.");
}

const headers = {
  Authorization: `Bearer ${token}`,
  "Content-Type": "application/json",
};

async function get(url) {
  const response = await fetch(url, { headers });
  const json = await response.json().catch(() => ({}));
  return { status: response.status, json };
}

const zones = await get(
  `https://api.cloudflare.com/client/v4/zones?name=${encodeURIComponent(domain)}`,
);

if (!zones.json.success) {
  console.log(JSON.stringify({ step: "zones", status: zones.status, errors: zones.json.errors }, null, 2));
  process.exit(1);
}

const zone = zones.json.result?.[0];
if (!zone) {
  console.log(JSON.stringify({ zone_found: false, domain }, null, 2));
  process.exit(0);
}

console.log(
  JSON.stringify(
    {
      zone_found: true,
      name: zone.name,
      status: zone.status,
      name_servers: zone.name_servers,
      original_name_servers: zone.original_name_servers,
    },
    null,
    2,
  ),
);

const records = await get(
  `https://api.cloudflare.com/client/v4/zones/${zone.id}/dns_records?per_page=100`,
);

console.log(
  JSON.stringify(
    {
      dns_records_read_success: records.json.success,
      dns_records: records.json.success
        ? records.json.result.map((record) => ({
            type: record.type,
            name: record.name,
            content: record.content,
            proxied: record.proxied,
          }))
        : [],
      errors: records.json.errors,
    },
    null,
    2,
  ),
);
