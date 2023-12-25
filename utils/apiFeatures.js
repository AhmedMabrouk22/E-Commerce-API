class ApiFeatures {
  constructor(stringQuery, config) {
    this.stringQuery = stringQuery;
    this.config = config;
  }

  //filter
  filter() {
    const queryObj = { ...this.stringQuery };
    const excludeFields = ["sort", "page", "limit", "fields"];
    excludeFields.forEach((elm) => {
      delete queryObj[elm];
    });
    this.config.filter = queryObj;
    return this;
  }

  //sorting
  sort() {
    if (this.stringQuery.sort) {
      this.config.sort = this.stringQuery.sort.split(",");
    }
    return this;
  }

  //paginate
  paginate() {
    const page = this.stringQuery.page * 1 || 1;
    const limit = this.stringQuery.limit * 1 || 100;
    const skip = (page - 1) * limit;
    this.config.paginate = { limit, skip };
    return this;
  }

  // limitFields
  limitFields() {
    if (this.stringQuery.fields) {
      const fields = this.stringQuery.fields.split(",");
      this.config.fields = fields;
    } else {
      this.config.fields = "*";
    }
    return this;
  }
}

module.exports = ApiFeatures;
