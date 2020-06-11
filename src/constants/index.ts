const SALT_ROUNDS = 10

const FB_GRAPH_API_HOST = 'https://graph.facebook.com'

const FB_GRAPH_API_VER = 'v7.0'

const PIPELINE_USER = [
	{
		$lookup: {
			from: 'users',
			localField: 'createdBy',
			foreignField: '_id',
			as: 'createdBy'
		}
	},
	{
		$unwind: {
			path: '$createdBy',
			preserveNullAndEmptyArrays: true
		}
	},
	{
		$lookup: {
			from: 'users',
			localField: 'updatedBy',
			foreignField: '_id',
			as: 'updatedBy'
		}
	},
	{
		$unwind: {
			path: '$updatedBy',
			preserveNullAndEmptyArrays: true
		}
  },
  {
		$lookup: {
			from: 'users',
			localField: 'deletedBy',
			foreignField: '_id',
			as: 'deletedBy'
		}
	},
	{
		$unwind: {
			path: '$deletedBy',
			preserveNullAndEmptyArrays: true
		}
	}
]


export { SALT_ROUNDS, FB_GRAPH_API_HOST, FB_GRAPH_API_VER, PIPELINE_USER }
