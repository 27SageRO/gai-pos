type UserState = {
  profile?: UserProfile;
};

type UserProfile = {
  storeName: string;
  ownerName: string;
  email: string;
  password: string;
  vatRegTin?: string;
  cashierName?: string;
};
