// notes on senior checkpoint

//1) what is the difference between 
validate: {
	notNull: true
}

//and

allowNull: false 

//2) 
/*
    You may not have seen the following method of association before.

    The following two lines add two additional columns to
    the `messages` table: `toId` and `fromId`.

    The `as` key in the options object is called an "alias"
    and allows for us to associate foreign keys of the same entity--
    in this case, user--more than once on a single model/table.

    These aliases will be important to remember and reference throughout
    the server portion of the checkpoint.

    http://docs.sequelizejs.com/en/v3/docs/associations/#naming-strategy
 */
Message.belongsTo(User, { as: 'to' });
Message.belongsTo(User, { as: 'from' });