export const SampleChat = [
        {
            avatar:["https://cdn.vectorstock.com/i/preview-1x/17/61/male-avatar-profile-picture-vector-10211761.jpg"],
            name:"Abhishek",
            _id:"1",
            groupChat:false,
            members:["1","2"]
        },
        {
            avatar:["https://cdn.vectorstock.com/i/preview-1x/17/61/male-avatar-profile-picture-vector-10211761.jpg"],
            name:"Abhishek pnld",
            _id:"2",
            groupChat:false,
            members:["1","2"]
        },
]


export const SampleUsers = [
    {
        avatar:["https://cdn.vectorstock.com/i/preview-1x/17/61/male-avatar-profile-picture-vector-10211761.jpg"],
        name:"Abhishek",
        _id:"1",
      
    },
    {
        avatar:["https://cdn.vectorstock.com/i/preview-1x/17/61/male-avatar-profile-picture-vector-10211761.jpg"],
        name:"Abhishek pnld",
        _id:"2",
      
    },
]

export const SampleNotifications = [
    {sender:{
        avatar:["https://cdn.vectorstock.com/i/preview-1x/17/61/male-avatar-profile-picture-vector-10211761.jpg"],
        name:"Abhishek"
    },
        _id:"1",
      
    },
    {
        sender:{
        avatar:["https://cdn.vectorstock.com/i/preview-1x/17/61/male-avatar-profile-picture-vector-10211761.jpg"],
        name:"Abhishek pnld"
    },
        _id:"2",
      
    },
]

export const SampleMessages = [
    {
     
        content:"my message",
        _id:"64242042hkjwhr4273",
        sender:{
            _id:"user_id",
            name:"abhi"
        },
        chat:"chatId",
        createdAt:"2024-02-12T10:41:30.630Z"
    },
    {
        attachments:[
            {
                public_id:"324892402",
                url:"https://cdn.vectorstock.com/i/preview-1x/17/61/male-avatar-profile-picture-vector-10211761.jpg"
            }
        ],
        content:"",
        _id:"64242042hkjwhr42731",
        sender:{
            _id:"1234566",
            name:"abhi 2"
        },
        chat:"chatId",
        createdAt:"2024-02-12T10:41:30.630Z"
    },
];

export const dashboardData = {
    users:[
        {
            name:"user1",
            avatar:"https://cdn.vectorstock.com/i/preview-1x/17/61/male-avatar-profile-picture-vector-10211761.jpg",
            _id:"1",
            username:"user1",
            friends:25,
            groups:5
        },
        {
            name:"user2",
            avatar:"https://cdn.vectorstock.com/i/preview-1x/17/61/male-avatar-profile-picture-vector-10211761.jpg",
            _id:"2",
            username:"user2",
            friends:30,
            groups:15
        },
    ],
    chats:[
        
            {
                name:"group1",
                avatar:["https://cdn.vectorstock.com/i/preview-1x/17/61/male-avatar-profile-picture-vector-10211761.jpg"],
                _id:"1",
                groupChat:false,
                members:[
                    {_id:"1",avatar:"https://cdn.vectorstock.com/i/preview-1x/17/61/male-avatar-profile-picture-vector-10211761.jpg"},
                    {_id:"2",avatar:"https://cdn.vectorstock.com/i/preview-1x/17/61/male-avatar-profile-picture-vector-10211761.jpg"}
                ],
                totalMembers:2,
                totalMessages:20,
                creator:{
                    name:"user2",
                    avatar:"https://cdn.vectorstock.com/i/preview-1x/17/61/male-avatar-profile-picture-vector-10211761.jpg"
                }
            },
            {
                name:"group2",
                avatar:["https://cdn.vectorstock.com/i/preview-1x/17/61/male-avatar-profile-picture-vector-10211761.jpg"],
                _id:"2",
                groupChat:false,
                members:[
                    {_id:"1",avatar:"https://cdn.vectorstock.com/i/preview-1x/17/61/male-avatar-profile-picture-vector-10211761.jpg"},
                    {_id:"2",avatar:"https://cdn.vectorstock.com/i/preview-1x/17/61/male-avatar-profile-picture-vector-10211761.jpg"}
                ],
                totalMembers:2,
                totalMessages:20,
                creator:{
                    name:"user1",
                    avatar:"https://cdn.vectorstock.com/i/preview-1x/17/61/male-avatar-profile-picture-vector-10211761.jpg"
                }
            },
    
    
    ]
}