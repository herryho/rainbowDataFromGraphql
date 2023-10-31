const fs = require("fs");
const { request, gql } = require("graphql-request");
const cron = require("node-cron");
const axios = require('axios')

const Bonnie_ID='U02298KLM97'
const Ares_ID="U047E07BT9N"
// const SLACK_URL = 'https://hooks.slack.com/services/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'

// test
const SLACK_URL = 'https://hooks.slack.com/services/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'

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

const fetchData = async () => {
  let jsonData = {};

  const data = await request(endpoint, query);
  const today = new Date();
  const todayString = `${today.getFullYear()}-${today.getMonth() + 1
    }-${today.getDate()}`; // 注意：getMonth() 是基于0的，所以加1
  jsonData[todayString] = data.getCampaignTopList2.length;
  const slackMessage = {
    text:`<@${Bonnie_ID}> Rainbow Boost participants:${todayString}:*${data.getCampaignTopList2.length}*`
  }
  await axios.post(SLACK_URL, slackMessage);
  console.log(`${todayString},Message sent to Slack!`);

};

fetchData();
// Schedule the task to run at 11:00 every day
cron.schedule("0 11 * * *", fetchData);
