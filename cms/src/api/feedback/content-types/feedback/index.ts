export default {
    info: {
        tableName: 'feedbacks',
        singularName: 'feedback',
        pluralName: 'feedbacks',
        displayName: 'Feedback',
        description: 'User feedback collection',
    },
    options: {
        draftAndPublish: true,
    },
    attributes: {
        rating: {
            type: 'decimal',
            required: true,
            min: 0.5,
            max: 5,
        },
        feedback: {
            type: 'text',
        },
    },
}; 
