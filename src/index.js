const fs = require("fs");
const { request, gql } = require("graphql-request");
const cron = require("node-cron");

const fetchData = async () => {
  let jsonData = {};
  if (fs.existsSync("./participantsData.json")) {
    jsonData = JSON.parse(fs.readFileSync("./participantsData.json"));
  }

  const endpoint = "https://dapp-api.bifrost.finance/rainbow-pro";
  const query = gql`
    {
      getCampaignTopList2(campaignIndex: "7", fromRank: 1, toRank: 10000) {
        rank
        account
        raindrops
        total
        rewards {
          token
          amount
        }
      }
    }
  `;

  const data = await request(endpoint, query);
  const today = new Date();
  const todayString = `${today.getFullYear()}-${
    today.getMonth() + 1
  }-${today.getDate()}`; // 注意：getMonth() 是基于0的，所以加1
  jsonData[todayString] = data.getCampaignTopList2.length;
  fs.writeFileSync("./participantsData.json", JSON.stringify(jsonData));
};

// Schedule the task to run at 11:00 every day
cron.schedule("0 11 * * *", fetchData);
