export default interface IProfileController {
    addVillagerToList(villagerIdToAdd: string, listId: string): void;
    removeVillagerFromList(villagerIdToAdd: string, listId: string): void;
}
