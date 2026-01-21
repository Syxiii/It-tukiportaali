import prisma from "../prisma/client.js";

export async function getTicketComment(req, res) {
    const { ticketid } = req.params

    const id = Number(ticketid);
    if (isNaN(id)){
        return res.status(400).json({error: "Ticket id does not exist"});
    }
    
    try {
        const comments = prisma.ticket.findMany({
            where : {ticketid: id},
            orderBy: {createdAt : "asc"},
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },

        },
    );
    
    return res.json(comments);

    }catch(error){
        console.error(error);
        return res.status(500).json({ error: "Failed to fetch comments" });
    }
}

export async function createTicketComment(req, res) {
    const { ticketId } = req.params;
    const { content } = req.body;
    const userId = req.user.id; 

    if (!content || content.trim() === "") {
    return res.status(400).json({ error: "Comment content is required" });
    } 

    try {
    const comment = await prisma.comment.create({
        data: {
        content,
        ticketId: Number(ticketId),
        userId,
        },
    });

    res.status(201).json(comment);
    } catch (error) {
        res.status(500).json({ error: "Failed to create comment" });
    }
}

export async function updateTicketComment(req, res){

    const { ticketId, commentId } = req.params;
    const { content } = req.body;
    const userId = req.user.id; 

    if (!content || content.trim() === "") {
    return res.status(400).json({ error: "Comment content is required" });

    } 
    try{
        const comment = await prisma.comment.findUnique({
        where: {id: Number(commentId)},
    });

    if (!comment || comment.ticketId !== Number(ticketId)) {
        return res.status(404).json({ error: "Comment not found" });
    }

    if (comment.userId !== userId) {
        return res.status(403).json({ error: "Not allowed to edit this comment" });
    }

    const updatedComment = await prisma.comment.update({
        where :{id: Number(commentId)},
        data : {content},
    });

    return res.json(updatedComment);

    }catch(error){
        console.error(err);
        return res.status(500).json({ error: "Failed to update comment" });
    }

}

export async function deleteTicketComment(req, res) {
    const { ticketId, commentId } = req.params;
    const userId = req.user.id;
    try {
        const comment = await prisma.comment.findUnique({
            where: { id: Number(commentId) },
        });
        if (!comment || comment.ticketId !== Number(ticketId)) {
            return res.status(404).json({ error: "Comment not found" });
        }
        if (comment.userId !== userId) {
            return res.status(403).json({ error: "Not allowed to delete this comment" });
        }
        await prisma.comment.delete({
            where: { id: Number(commentId) },
        });
        return res.json({ message: "Comment deleted successfully" });
    }

    catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Failed to delete comment" });
    }
}