import React from 'react';
import CheckIcon from '@material-ui/icons/Check';
import LockIcon from '@material-ui/icons/Lock';

export const onboardingStepDependencies = {
    "organization": {
        "organization": []
    },
    "branding": {
        "branding": ["organization"],
        "brand-guidelines": ["organization"],
        "verbiage-taglines-and-fonts": ["brand-guidelines"],
        "sports-teams": ["verbiage-taglines-and-fonts"],
        "logos-and-approved-colors": ["sports-teams"]
    },
    "catalog-and-products": {
        "catalog-and-products": ["branding"],
        "sponsored-apparel-brands": ["branding"]

    },
    "groups": {
        "groups": ["catalog-and-products"]
    },


    "licensing-and-royalties": {
        "licensing-and-royalties": ["groups"]
    },
    "billing": {
        "billing": ["licensing-and-royalties"]
    },
    "checkout-options": {
        "checkout-options": ["billing"]
    },
    "approvals-and-order-processing": {
        "approvals-and-order-processing": ["checkout-options"]
    },
    "access-and-content": {
        "access-and-content": ["approvals-and-order-processing"],
        "marketingImages": ["approvals-and-order-processing"],
        "contactInfo": ["marketingImages"]
    },
    "final-review": {
        "final-review": ["access-and-content"]
    }
};

export function getOnboardingStatus(onboardingStatuses, sectionOrStepName) {
    // Don't try to search in non-objects.
    if (onboardingStatuses === undefined
        || typeof onboardingStatuses !== 'object'
        || onboardingStatuses === null) {
        console.log("Invalid statuses object", onboardingStatuses);
        return onboardingStatus.LOCKED;
    }

    // Check if step is section and get section root.
    if (sectionOrStepName in onboardingStatuses) {
        if (typeof onboardingStatuses[sectionOrStepName] === 'object'
            && sectionOrStepName in onboardingStatuses[sectionOrStepName]) {
            return onboardingStatuses[sectionOrStepName][sectionOrStepName];
        }
        return onboardingStatuses[sectionOrStepName]
    }

    // Find step in sections and get status.
    const keys = Object.keys(onboardingStatuses);
    for (let i = 0; i < keys.length; i++) {
        const inner = onboardingStatuses[keys[i]]
        if (typeof inner === 'object'
            && inner != null
            && sectionOrStepName in inner) {
            return inner[sectionOrStepName];
        }
    }
    // Default to locked.
    return onboardingStatus.LOCKED;
}

export function allStatusesAreComplete(statusObject) {
    // Don't try to search in non-objects.
    if (statusObject === undefined
        || typeof statusObject !== 'object'
        || statusObject === null) {
        console.log("Invalid statuses object", statusObject);
        return false;
    }

    const keys = Object.keys(statusObject);

    for (let i = 0; i < keys.length; i++) {
        const keyItem = statusObject[keys[i]]
        if (typeof keyItem === "object") {
            if (!allStatusesAreComplete(keyItem)) {
                return false;
            }
        } else if (typeof keyItem === "string" && !(keyItem === onboardingStatus.COMPLETE || keyItem === onboardingStatus.DISABLED)) {
            return false;
        }
    }

    return true;
}

export function getFirstSectionOrStepWithMessage(messages, parentName, sectionIfStep = false) {
    var keys = Object.keys(messages);
    for (let i = 0; i < keys.length; i++) {
        const keyItem = messages[keys[i]];
        // It's a section.
        if (typeof keyItem === "object" && getOnboardingStatus(messages, keys[i])) {
            const stepWithMessage = getFirstSectionOrStepWithMessage(keyItem, parentName);
            if (stepWithMessage) {
                if (sectionIfStep) {
                    return keys[i];
                }
                return stepWithMessage;
            }
        }
        // It's a step.
        else if (typeof keyItem === "string" && keyItem) {
            if (keys[i] !== parentName) {
                return keys[i];
            }
        }
    }
    return "";
}

export function getFirstUnlockedSectionOrStep(statuses, parentName) {
    var keys = Object.keys(statuses);
    for (let i = 0; i < keys.length; i++) {
        const keyItem = statuses[keys[i]];
        // It's a section.
        if (typeof keyItem === "object" && getOnboardingStatus(statuses, keys[i]) === onboardingStatus.UNLOCKED) {
            if (keys[i] !== parentName) {
                return keys[i];
            }
        }
        // It's a step.
        else if (typeof keyItem === "string" && keyItem === onboardingStatus.UNLOCKED) {
            if (keys[i] !== parentName) {
                return keys[i];
            }
        }
    }
    return "";
}

export function getStatusIcon(status) {
    if (status === onboardingStatus.COMPLETE) {
        return (<><CheckIcon fontSize="small" style={{ marginTop: "-4px", fill: "green" }} />&nbsp;</>);
    }
    else if (status === onboardingStatus.LOCKED) {
        return (<><LockIcon fontSize="small" style={{ marginTop: "-2px", fill: "goldenrod" }} />&nbsp;</>);
    }
    else if (status === onboardingStatus.UNLOCKED) {
        return "";
    }
    else {
        return "";
    }
}

export const onboardingStatus = {
    UNLOCKED: "unlocked",
    LOCKED: "locked",
    COMPLETE: "complete",
    DISABLED: "disabled",
}

export const onboardingSections = {
    ORGANIZATION: {
        name: "organization",
        label: "Organization",
        steps: {

        }
    },
    BRANDING: {
        name: "branding",
        label: "Branding",
        steps: {
            BRAND_GUIDELINES: {
                name: "brand-guidelines",
                label: "Brand Guidelines",
                disabled: false
            },
            VERBIAGE_TAGLINES_AND_FONTS: {
                name: "verbiage-taglines-and-fonts",
                label: "Verbiage, Taglines, & Fonts"
            },
            SPORTS_TEAMS: {
                name: "sports-teams",
                label: "Sports Teams"
            },
            LOGOS_AND_APPROVED_COLORS: {
                name: "logos-and-approved-colors",
                label: "Logos & Approved Colors"
            }
        }
    },
    CATALOG_AND_PRODUCTS: {
        name: "catalog-and-products",
        label: "Catalog & Products",
        steps: {

            SPONSORED_APPAREL_BRANDS: {
                name: "sponsored-apparel-brands",
                label: "SPONSORED APPAREL Guidelines"
            }

        }
    },

    GROUPS: {
        name: "groups",
        label: "Groups",
        steps: {

        }
    },
    LICENSING_AND_ROYALTIES: {
        name: "licensing-and-royalties",
        label: "Licensing & Royalties",
        steps: {

        }
    },
    BILLING: {
        name: "billing",
        label: "Billing",
        steps: {

        }
    },
    CHECKOUT_OPTIONS: {
        name: "checkout-options",
        label: "Checkout Options",
        steps: {

        }
    },
    APPROVALS_AND_ORDER_PROCESSING: {
        name: "approvals-and-order-processing",
        label: "Approvals & Order Processing",
        steps: {

        }
    },
    ACCESS_AND_CONTENT: {
        name: "access-and-content",
        label: "Access & Content",
        steps: {
            MARKETINGIMAGES: {
                name: "marketingImages",
                label: "Marketing Images"
            },
            ContactInfo: {
                name: "contactInfo",
                label: "Contact Information"
            }

        }
    },
    FINAL_REVIEW: {
        name: "final-review",
        label: "Final Review",
        steps: {

        }
    }
}