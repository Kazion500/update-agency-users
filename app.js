import axios from "axios"
import dotenv from "dotenv"
import fs from "fs"

dotenv.config()

const axiosInstance = axios.create({
    baseURL: "https://rest.gohighlevel.com/v1",
    headers: {
        "Authorization": `Bearer ${process.env.HIGHLEVEL_API_KEY}`
    }
})

const main = async () => {
    try {
        const response = await axiosInstance.get("/locations")
        fs.writeFileSync("locations.json", JSON.stringify(response.data, null, 2))
        const locations = response.data.locations
        processLocations(locations)

    } catch (error) {
        console.log(error.response.data.msg);
    }
}

function processLocations(locations) {
    locations.forEach(location => {
        getUsers(location.apiKey)
    })
}

async function getUsers(locationApiKey) {
    try {
        // const response = await axios({
        //     method: "get",
        //     url: `https://rest.gohighlevel.com/v1/users`,
        //     headers: {
        //         "Authorization": `Bearer ${locationApiKey}`
        //     }
        // })
        // const users = response.data.users
        await updateUser([])
    } catch (error) {
        console.log("error.response.data.msg :>> ", error.response.data.msg);
    }
}

async function updateUser(users) {
    try {
        const payload = {
            permissions: {
                campaignsEnabled: false,
                campaignsReadOnly: false,
                contactsEnabled: true,
                workflowsEnabled: false,
                triggersEnabled: false,
                funnelsEnabled: false,
                websitesEnabled: false,
                opportunitiesEnabled: true,
                dashboardStatsEnabled: true,
                bulkRequestsEnabled: false,
                appointmentsEnabled: true,
                reviewsEnabled: false,
                onlineListingsEnabled: false,
                phoneCallEnabled: false,
                conversationsEnabled: true,
                assignedDataOnly: true,
                adwordsReportingEnabled: false,
                membershipEnabled: false,
                facebookAdsReportingEnabled: false,
                attributionsReportingEnabled: false,
                settingsEnabled: false,
                tagsEnabled: true,
                leadValueEnabled: true,
                marketingEnabled: false,
            },
        }

        for (const user of users) {
            payload['email'] = user.email
            payload['firstName'] = user.firstName
            payload['lastName'] = user.lastName

            if (user.roles.role.toLowerCase() === 'user') {
                const response = await axios({
                    method: "put",
                    url: `https://rest.gohighlevel.com/v1/users/${user.id}`,
                    headers: {
                        "Authorization": `Bearer ${process.env.HIGHLEVEL_API_KEY}`
                    },
                    data: payload
                })
                console.log(response.status);
            }


        }

    } catch (error) {
        console.log("error.response.data.msg :>> 101", error.response.data);
    }
}

main()