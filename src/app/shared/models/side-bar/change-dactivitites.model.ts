export class ChangeDactivitites {
    bidOpportunity: {
        bidOpportunityId: number,
        createdTime: number,
        createdEmployee: {
            id: number,
            employeeId: number,
            employeeNo: string,
            employeeName: string,
            employeeAddress: string,
            employeeDob: number,
            employeeTel: string,
            employeeTel1: string,
            departmentName: string,
            levelName: string,
            employeeAvatar: string,
            departmentRoomName: string,
            branchName: string,
            employeeBirthPlace: string,
            employeeIDNumber: string,
            employeeGender: string,
            employeeTaxNumber: string,
            employeeBankAccount: string
        },
        classify: {
            key: string,
            value: string,
            displayText: string
        },
        amount: number,
        opportunityName: string,
        projectName: string,
        projectType: {
            key: string,
            value: string,
            displayText: string
        },
        hbcRole: {
            type: string,
            name: string
        },
        chairEmployee: {
            id: number,
            employeeId: number,
            employeeNo: string,
            employeeName: string,
            employeeAddress: string,
            employeeDob: number,
            employeeTel: string,
            employeeTel1: string,
            departmentName: string,
            levelName: string,
            employeeAvatar: string,
            departmentRoomName: string,
            branchName: string,
            employeeBirthPlace: string,
            employeeIDNumber: string,
            employeeGender: string,
            employeeTaxNumber: string,
            employeeBankAccount: string
        },
        quarter: {
            type: string,
            name: string
        },
        magnitude: string,
        stage: {
            key: string,
            value: string,
            displayText: string
        },
        stageStatus: {
            key: string,
            value: string,
            displayText: string
        },
        hsmtStatus: {
            key: string,
            value: string,
            displayText: string
        },
        location: {
            key: string,
            value: string,
            displayText: string
        },
        projectNo: string,
        job: string,
        place: string,
        customer: {
            id: number,
            customerId: number,
            customerName: string,
            customerNo: string,
            customerDesc: string,
            customerClassify: string,
            customerNewOldType: string,
            customerPhone: string,
            customerAddress: string
        },
        customerContact: {
            id: number,
            name: string
        },
        consultantUnitCustomer: {
            id: number,
            customerId: number,
            customerName: string,
            customerNo: string,
            customerDesc: string,
            customerClassify: string,
            customerNewOldType: string,
            customerPhone: string,
            customerAddress: string
        },
        consultantAddress: string,
        consultantPhone: string,
        floorArea: number,
        mainBuildingCategory: {
            key: string,
            value: string,
            displayText: string
        },
        documentLink: string,
        status: {
            key: string,
            value: string,
            displayText: string
        },
        progress: number,
        acceptanceReason: string,
        unacceptanceReason: string,
        cancelReason: string,
        evaluation: {
            key: string,
            value: string,
            displayText: string
        },
        startTrackingDate: number,
        submissionDate: number,
        resultEstimatedDate: number,
        projectEstimatedStartDate: number,
        projectEstimatedEndDate: number,
        totalTime: string,
        description: string,
        expectedAcceptanceDate: number
    };
    bidActivityChangeEntityType: {
        key: string,
        value: string,
        displayText: string
    };
    bidActivityChangeEntityTableName: string;
    bidActivityChangeEntityId: number;
    bidActivityChangeEntityName: string;
    bidActivityChangeAction: {
        key: string,
        value: string,
        displayText: string
    };
    bidActivityChangeGotoUrl: string;
    bidActivityChangDate: number;
    changeEmployee: {
        id: number,
        employeeId: number,
        employeeNo: string,
        employeeName: string,
        employeeAddress: string,
        employeeDob: number,
        employeeTel: string,
        employeeTel1: string,
        departmentName: string,
        levelName: string,
        employeeAvatar: string,
        departmentRoomName: string,
        branchName: string,
        employeeBirthPlace: string,
        employeeIDNumber: string,
        employeeGender: string,
        employeeTaxNumber: string,
        employeeBankAccount: string
    };
}
