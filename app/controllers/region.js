const countries =
  [
    {
      country: 'General',
      regionId: '58f4de8ef08434413b6aec50'
    },
    {
      country: 'Nigeria',
      regionId: '58ed5fbe75ebcefb68f19750'
    },
    {
      country: 'USA',
      regionId: '58f531a4f08434413b6aec51'
    },
    {
      country: 'South Africa',
      regionId: '58ed60a875ebcefb68f19751'
    },
    {
      country: 'Kenya',
      regionId: '58ed60a875ebcefb68f19752'
    },
    {
      country: 'Uganda',
      regionId: '58ed60a875ebcefb68f19753'
    },
    {
      country: 'Ghana',
      regionId: '58ed60a875ebcefb68f19754'
    },
    {
      country: 'England',
      regionId: '58ed620175ebcefb68f19769'
    },
    {
      country: 'Spain',
      regionId: '58ed620175ebcefb68f1976a'
    },
    {
      country: 'Germany',
      regionId: '58ed620175ebcefb68f1976b'
    },
    {
      country: 'Sweden',
      regionId: '58ed620175ebcefb68f1976c'
    },
    {
      country: 'Denmark',
      regionId: '58ed620175ebcefb68f1976d'
    },
    {
      country: 'Italy',
      regionId: '58ed620175ebcefb68f1976e'
    },
    {
      country: 'France',
      regionId: '58ed620175ebcefb68f1976f'
    }
  ];

module.exports = {
  allJson(req, res) {
    res.jsonp(countries);
  },
  countries() {
    return countries;
  }
};
