// Airtable configuration and initialization
console.log('Hello Airtable-Fetch')
let Airtable = require('airtable');
Airtable.configure({
  endpointUrl: 'https://api.airtable.com',
  apiKey: 'patP9jOWRFht1T02U.0a30555a995176d6f048588060ef1cbc9c0c13a33fd0ad1e70d425a5805ce27d' // Ensure to keep this secure in production
});
let base = Airtable.base('appycH5K1scd6JsOZ');

let treeDynamic = [];

// // Fetch dynamic portfolio data from Airtable
base('data-airtable').select({
  view: "Grid view"
}).eachPage(fetchDynamicData, handleAirtableError);

function fetchDynamicData(records, fetchNextPage) {
  records.forEach(record => {

      // Access the correct field name (replace 'Attachments' with your actual field name)
      let mediaFiles = record.get('media'); // Adjust field name based on your log

      // Check if mediaFiles exists and is not empty
      if (mediaFiles && mediaFiles.length > 0) {
          // Map through the media files and extract URLs
          let mediaUrls = mediaFiles.map(file => file.url);
          console.log('Mapped Media URLs:', mediaUrls); // Log the mapped media URLs

          // Push the data into treeDynamic
          treeDynamic.push({
              'Order': record.get('Order'),
              'tierOne': record.get('tierOne'),
              'tierTwo': record.get('tierTwo'),
              'tierThree': record.get('tierThree'),
              'tierFour': record.get('tierFour'),
              'media': mediaUrls // Ensure media URLs are stored correctly
          });
      } else {
          treeDynamic.push({
              'Order': record.get('Order'),
              'tierOne': record.get('tierOne'),
              'tierTwo': record.get('tierTwo'),
              'tierThree': record.get('tierThree'),
              'tierFour': record.get('tierFour'),
              'media': [] // Store an empty array if no media
          });
      }
  });

  fetchNextPage(); // Fetch the next set of records

  if (treeDynamic.length > 0) {
      console.log('airtable-fetch.js | treeDynamic:', treeDynamic); // Log the final treeDynamic structure
      initializeAppFromTreeDynamic(); // Call initialization once data is fully loaded
  }
}
function handleAirtableError(err) {
  if (err) {
      console.error("Error fetching data from Airtable:", err);
      return;
  }
}