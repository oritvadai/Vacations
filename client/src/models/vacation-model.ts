export class VacationModel {

    public constructor(
        public vacationID?: number,
        public description?: string,
        public destination?: string,
        public picFileName?: string,
        public image?: File,
        public startDate?: string,
        public endDate?: string,
        public price?: number,
        public isFollowed?: boolean) {
    }
}