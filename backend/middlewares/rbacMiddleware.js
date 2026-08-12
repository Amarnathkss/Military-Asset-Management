export const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (
            !req.user ||
            !allowedRoles.includes(req.user.role)
        ) {
            return res.status(403).json({
                message: "Access denied: insufficient permissions.",
            });
        }

        next();
    };
};

export const enforceBaseScope = (req, res, next) => {
    if (req.user.role === "BASE_COMMANDER") {
        req.query.baseId = req.user.baseId;
    }

    next();
};

export const enforceRequestBase = (req, res, next) => {
    if (req.user.role === "BASE_COMMANDER") {
        const requestedBaseId = Number(req.body.baseId);

        if (requestedBaseId !== req.user.baseId) {
            return res.status(403).json({
                message:
                    "Access denied: you can only operate on your assigned base.",
            });
        }
    }

    next();
};